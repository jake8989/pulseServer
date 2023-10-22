import mongoose, { Document, Mongoose, Schema, Types } from 'mongoose';
interface IFriend {
	_id: string;
	user1: string;
	user2: string;
}

const friendSchema: Schema = new Schema({
	_id: {
		type: String,
		unique: true,
		trim: true,
	},
	user1: {
		type: String,
		required: true,
		trim: true,
	},
	user2: {
		type: String,
		required: true,
		trim: true,
	},
});

const Friend = mongoose.model<IFriend>('Friend', friendSchema);

export default Friend;
