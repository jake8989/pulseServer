import express from 'express';
import User from '../models/user';
import { UserType } from '../types';
import * as bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

const app = express();
const router = express.Router();
router.post(
	'/register',
	async (req: express.Request, res: express.Response) => {
		try {
			// console.log(req);
			const values = req.body;
			// console.log(values);
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(values.password, saltRounds);
			const user = {
				username: values.username,
				email: values.email,
				password: hashedPassword,
				profile: '',
				ext: values.ext,
			};
			const user1 = await User.findOne({ username: values.username });
			console.log(user1);
			if (user1) {
				return res
					.status(400)
					.json({ message: 'This username is not available ' });
			}
			const newUser = new User(user);
			console.log(newUser);
			newUser
				.save()
				.then(() => {
					res.status(200).json({
						// newUser,
						user: newUser.username,
						message: 'User Created Succesfully',
						token: generateToken(newUser.username),
					});
				})
				.catch((err) => {
					console.log(err);
					res.status(400).json({ message: 'Error try after some time' });
				});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error, message: 'Internal server error' });
		}
	}
);
router.post('/login', async (req: express.Request, res: express.Response) => {
	try {
		const values = req.body;
		const user1 = await User.findOne({ username: values.username });
		console.log(user1);
		if (user1 && (await bcrypt.compare(values.password, user1.password))) {
			return res.status(200).json({
				user: user1.username,
				message: 'Logged In Succesfully Boy',
				token: generateToken(user1.username),
			});
		}
		return res.status(400).json({ message: 'No user found' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error, message: 'Internal server error' });
	}
});
router.put(
	'/set-avtar',
	async (req: express.Request, res: express.Response) => {
		try {
			const values = req.body;
			const user1 = await User.findOne({ username: values.username });
			if (values.profile === '') {
				return res
					.status(400)
					.json({ message: 'You can select Default Profile Picture' });
			}
			console.log('Form avatar', user1);
			if (user1) {
				if (user1.profile !== '') {
					return res
						.status(401)
						.json({ message: 'Already Found avatar for this username!' });
				}
				const updateUser = await User.findOneAndUpdate(
					{ username: values.username },
					{ profile: values.profile },
					{ new: true }
				);
				const updateUser2 = await User.findOneAndUpdate(
					{ username: values.username },
					{ step: '/chat' },
					{ new: true }
				);
				return res.status(200).json({
					message: 'Avtar Updated Succesfully',
					user: updateUser2?.username,
				});
			}
			return res.status(400).json({ message: 'No user found' });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error, message: 'Internal server error' });
		}
	}
);
const generateToken = (username: string) => {
	const secretString = process.env.JWT_SECRET;
	if (!secretString) {
		return null;
	}
	return jwt.sign({ username }, secretString, {
		expiresIn: '7d',
	});
};

export default router;
