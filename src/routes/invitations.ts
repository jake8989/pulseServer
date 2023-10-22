import express from 'express';
import Chat from '../models/chatModel';
import { nanoid } from 'nanoid';
import Inviation, { STATUS } from '../models/invitationModel';
import { STATES } from 'mongoose';
import User from '../models/user';
import Friend from '../models/friendModel';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
interface RequestWithUser extends express.Request {
	_id: string;
}
router.get(
	'/test-invitation',
	(req: RequestWithUser, res: express.Response) => {
		const _id = req._id;
		console.log(_id);
		res.send('/hii');
	}
);
router.post(
	'/create-invitation',
	async (req: RequestWithUser, res: express.Response) => {
		const sender_id = req._id;
		const reciever_id = req.body.reciever_id;
		console.log(sender_id, reciever_id);
		const existInvitation = await Inviation.findOne({
			sender: sender_id,
			reciever: reciever_id,
		});
		if (existInvitation) {
			return res.status(400).json({ message: 'Invitation Already Exists' });
		}
		const invitaion = {
			_id: uuidv4(),
			sender: sender_id,
			reciever: reciever_id,
			status: STATUS.PENDING,
		};
		const recieverUser = await User.findById(reciever_id);
		const newInvitation = new Inviation(invitaion);
		newInvitation
			.save()
			.then(() => {
				console.log(newInvitation);
				return res.status(200).json({
					message: `Invitation Sent to User:  ${recieverUser.username}`,
				});
			})
			.catch((err) => {
				return res.status(400).json({ message: 'Internal Server Error' });
			});
	}
);
router.get(
	'/all-sent-requests',
	async (req: RequestWithUser, res: express.Response) => {
		const sender_id = req._id;
		const sender = await User.findById(sender_id);
		const pendingInvitations = await Inviation.find({
			sender: sender_id,
			status: STATUS.PENDING,
		});
		// console.log(pendingInvitations);
		// return res.json({ pendingInvitations });
		const promises = pendingInvitations.map(async (invitation) => {
			const reciever = await User.findById(invitation.reciever);
			// return ()
			return {
				invitation_id: invitation._id,
				sender_id: invitation.sender,
				sender_username: sender.username,
				sender_profile: sender.profile,
				reciever_id: invitation.reciever,
				reciever_username: reciever.username,
				reciever_profile: reciever.profile,
			};
		});
		if (!promises) {
			return res.status(400).json({ message: 'No Sent Invitations' });
		}
		const result = await Promise.all(promises);
		return res.status(200).json(result);
	}
);
router.get(
	'/all-recieved-requests',
	async (req: RequestWithUser, res: express.Response) => {
		const reciever_id = req._id;
		const reciever = await User.findById(reciever_id);
		const pendingInvitations = await Inviation.find({
			reciever: reciever_id,
			status: STATUS.PENDING,
		});
		// console.log(pendingInvitations);
		// return res.json({ pendingInvitations });
		const promises = pendingInvitations.map(async (invitation) => {
			const sender = await User.findById(invitation.sender);
			// return ()
			return {
				invitation_id: invitation._id,
				sender_id: invitation.sender,
				sender_username: sender.username,
				sender_profile: sender.profile,
				reciever_id: invitation.reciever,
				reciever_username: reciever.username,
				reciever_profile: reciever.profile,
			};
		});
		if (!promises) {
			return res.status(400).json({ message: 'No Sent Invitations' });
		}
		const result = await Promise.all(promises);
		return res.status(200).json(result);
	}
);
router.post(
	'/accept-invite',
	async (req: RequestWithUser, res: express.Response) => {
		const reciever_id = req._id;
		const invitation_id = req.body.invitation_id;
		const invitaion = await Inviation.findById(invitation_id);
		if (!invitaion) {
			return res.status(500).json({ message: 'Server Error' });
		}
		if (
			invitaion.status === STATUS.ACCEPTED ||
			invitaion.status === STATUS.REJECTED
		) {
			return res.status(500).json({ message: 'Invitation Expired' });
		}
		//make friends
		const friend = {
			_id: invitation_id,
			user1: invitaion.reciever,
			user2: invitaion.sender,
		};
		const newFriend = new Friend(friend);
		newFriend
			.save()
			.then(async () => {
				console.log(newFriend);
				if (newFriend) {
					await Inviation.updateOne(
						{ _id: invitation_id },
						{ status: STATUS.ACCEPTED }
					);
					return res.status(200).json({
						message: 'Added Succesfully to your friend list',
						newFriend,
						// updateInvitation,
					});
				} else {
					return res
						.status(400)
						.json({ message: 'Cannot preform this action' });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: 'Server Error' });
			});
	}
);
router.post(
	'/delete-invitation',
	async (req: RequestWithUser, res: express.Response) => {
		const invitation_id = req.body.invitation_id;
		const invitation = await Inviation.findById(invitation_id);
		if (!invitation) {
			return res.status(400).json({ message: 'No invitation Found' });
		}
		Inviation.findOneAndDelete({ _id: invitation_id })
			.then(() => {
				return res
					.status(200)
					.json({ message: 'Invitation deleted Successfully' });
			})
			.catch(() => {
				return res.status(200).json({ message: 'Server Error'! });
			});
	}
);
export default router;
