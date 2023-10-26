import mongoose, { Schema, Document } from 'mongoose';
interface ChatType {
	chatName: string;
	isGroupChat: boolean;
	users: [mongoose.Schema.Types.ObjectId];
	latestMessage: mongoose.Schema.Types.ObjectId;
}
const chatSchema = new Schema(
	{
		chatId: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
	},
	{
		timestamps: true,
	}
);
const Chat = mongoose.model<ChatType>('Chat', chatSchema);
export default Chat;
