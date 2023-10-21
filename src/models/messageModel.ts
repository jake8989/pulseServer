import mongoose, { Schema, Document } from 'mongoose';

import { transpileModule } from 'typescript';
interface MessageType {
	sender: mongoose.Schema.Types.ObjectId;
	content: string;
	chat: mongoose.Schema.Types.ObjectId;
}
const messageSchema = new Schema(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		content: { type: String, trim: true },
		chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
	},

	{
		timestamps: true,
	}
);
const Message = mongoose.model<MessageType>('Message', messageSchema);
export default Message;
