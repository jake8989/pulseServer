import express from 'express';
import Inviation, { STATUS } from '../models/invitationModel';
import User from '../models/user';
import Friend from '../models/friendModel';
import Message from '../models/messageModel';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
interface RequestWithUser extends express.Request {
	_id: string;
}
router.post(
	'/save-chat',
	async (req: RequestWithUser, res: express.Response) => {
		const sender_id = req._id;
		// console.log('sender+id', sender_id);
		const chatId = req.body.chatId;
		const content = req.body.content;
		const senderUsername = await User.findById(sender_id);
		const newMessage = {
			chatId: chatId,
			sender: sender_id,
			senderUsername: senderUsername.username,
			content: content,
			// date: new Date().getTime(),
		};
		const saveMessage = new Message(newMessage);
		saveMessage
			.save()
			.then(() => {
				// console.log(saveMessage);
				return res.status(200).json(saveMessage);
			})
			.catch((err) => {
				console.log(err);
				return res
					.status(400)
					.json({ message: 'Cannot save message in the DB' });
			});
	}
);
router.get(
	'/get-chats',
	async (req: RequestWithUser, res: express.Response) => {
		const chat_id = req.query.chat_id;
		// console.log(chat_id);
		try {
			const allMessages = await Message.find({ chatId: chat_id });
			return res.status(200).json(allMessages);
		} catch (error) {
			return res.status(400).json({ message: 'Error Loading Previous Chats' });
		}
	}
);
export default router;
