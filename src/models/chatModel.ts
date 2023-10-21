import mongoose, { Schema, Document } from 'mongoose';

import { transpileModule } from 'typescript';
interface ChatType {
	chatName: string;
	isGroupChat: boolean;
	users: [mongoose.Schema.Types.ObjectId];
	latestMessage: mongoose.Schema.Types.ObjectId;
	groupAdmin: mongoose.Schema.Types.ObjectId;
}
const chatSchema = new Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
		groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	}
);
const Chat = mongoose.model<ChatType>('Chat', chatSchema);
export default Chat;
