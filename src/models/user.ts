import mongoose, { Schema, Document } from 'mongoose';
import { transpileModule } from 'typescript';
interface userType {
	username: string;
	email: string;
	password: string;
	profile: string;
	ext: number;
}
const userSchema = new Schema({
	username: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true },
	password: { type: String, required: true, trim: true },
	profile: { type: String, trim: true, default: '' },
	step: { type: String, trim: true, default: '/dashboard' },
	ext: { type: Number, default: 0 },
});
const User = mongoose.model<userType>('User', userSchema);
export default User;
