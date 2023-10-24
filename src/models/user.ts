import mongoose, { Schema, Document } from 'mongoose';
import { transpileModule } from 'typescript';
interface userType {
	username: string;
	email: string;
	password: string;
	profile: string;
	step: string;
	ext: number;
	isAdmin: boolean;
	// isAvtarSetted: boolean;
}
const userSchema = new Schema(
	{
		username: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true },
		password: { type: String, required: true, trim: true },
		profile: { type: String, trim: true, default: '/favicon.ico' },
		step: { type: String, trim: true, default: '/dashboard' },
		ext: { type: Number, default: 0 },
		isAdmin: { type: Boolean, required: true, default: false },
		// isAvtarSetted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);
const User = mongoose.model<userType>('User', userSchema);
export default User;
