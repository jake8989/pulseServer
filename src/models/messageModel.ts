import mongoose, { Schema, Document } from 'mongoose';

import { transpileModule } from 'typescript';
interface MessageType {
	chatId: string;
	sender: string;
	senderUsername: string;
	content: string;
	date: Date;
}
const messageSchema = new Schema(
	{
		chatId: { type: String, required: true },
		sender: { type: String, required: true },
		senderUsername: { type: String, required: true, default: 'user' },
		content: { type: String, trim: true },
		date: { type: Date, trim: true },
	},

	{
		timestamps: true,
	}
);
const Message = mongoose.model<MessageType>('Message', messageSchema);
export default Message;
