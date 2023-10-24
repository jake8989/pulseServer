import express from 'express';
import Chat from '../models/chatModel';
import { nanoid } from 'nanoid';
import Inviation, { STATUS } from '../models/invitationModel';
// import { Promise, STATES } from 'mongoose';
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
		const receiver_id = req.body.receiver_id;
		console.log(sender_id, receiver_id);
		if (sender_id === receiver_id) {
			return res.status(400).json({ message: 'Cannot Perform This Action' });
		}
		const existFriends = Friend.findOne({
			sender_id: sender_id,
			receiver_id: receiver_id,
		});
		// const ef1 = Friend.findOne({
		// 	sender_id: receiver_id,
		// 	receiver_id: sender_id,
		// });

		const existInvitation = await Inviation.findOne({
			sender: sender_id,
			receiver: receiver_id,
		});
		const existInvitation2 = await Inviation.findOne({
			sender: receiver_id,
			receiver: sender_id,
		});
		if (existInvitation || existInvitation2) {
			return res.status(400).json({
				message:
					'Invitation Already Exists Check Invitations or You are already Friends',
			});
		}
		const invitaion = {
			_id: uuidv4(),
			sender: sender_id,
			receiver: receiver_id,
			status: STATUS.PENDING,
		};
		const receiverUser = await User.findById(receiver_id);
		const newInvitation = new Inviation(invitaion);
		newInvitation
			.save()
			.then(() => {
				console.log(newInvitation);
				return res.status(200).json({
					message: `Invitation Sent to User:  ${receiverUser.username}`,
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
			const receiver = await User.findById(invitation.receiver);
			// return ()
			return {
				invitation_id: invitation._id,
				sender_id: invitation.sender,
				sender_username: sender.username,
				sender_profile: sender.profile,
				receiver_id: invitation.receiver,
				receiver_username: receiver.username,
				receiver_profile: receiver.profile,
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
	'/all-received-requests',
	async (req: RequestWithUser, res: express.Response) => {
		const receiver_id = req._id;
		const receiver = await User.findById(receiver_id);
		const pendingInvitations = await Inviation.find({
			receiver: receiver_id,
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
				receiver_id: invitation.receiver,
				receiver_username: receiver.username,
				receiver_profile: receiver.profile,
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
		const receiver_id = req._id;
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
			user1: invitaion.receiver,
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
				return res.status(500).json({ message: 'Server Error' });
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
				return res.status(500).json({ message: 'Server Error'! });
			});
	}
);
router.get(
	'/users-friends',
	async (req: RequestWithUser, res: express.Response) => {
		const user_id = req._id;
		const usid1 = await Friend.find({ user1: user_id });
		const usid2 = await Friend.find({ user2: user_id });
		const promise1 = usid1.map(async (usid) => {
			const user = await User.findById(usid.user2);
			return {
				_id: usid._id,
				friendId: usid._id,
				friendUsername: user.username,
				friendEmail: user.email,
				friendProfile: user.profile,
			};
		});
		const promise2 = usid2.map(async (usid) => {
			const user = await User.findById(usid.user1);
			return {
				_id: usid._id,
				friendId: user._id,
				friendUsername: user.username,
				friendEmail: user.email,
				friendProfile: user.profile,
			};
		});
		const arr = await Promise.all(promise1);
		const brr = await Promise.all(promise2);
		const result = [...arr, ...brr];
		res.status(200).json({ message: 'List', result });
	}
);
export default router;
