import jwt from 'jsonwebtoken';
import express from 'express';
import env from 'dotenv';
// import User from '../models/user';
env.config();
interface RequestWithUser extends express.Request {
	_id: string;
}

async function protect(
	req: RequestWithUser,
	res: express.Response,
	next: express.NextFunction
) {
	// try {
	// 	const token = req.headers.authorization;

	// 	if (!token) return res.status(400).json('Provide A Token!');
	// 	const jwtsecret = process.env.JWT_SECRET;
	// 	if (!jwtsecret) {
	// 		return null;
	// 	}
	// 	const verified: any = await jwt.verify(token, jwtsecret);
	// 	if (!verified) return res.status(400).json('token does not matched');

	// 	req._id = verified.user;

	// 	next();
	// } catch (e) {
	// 	console.log(e);
	// 	res.status(400).json('unauthorised');
	// }
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decode: any = jwt.verify(token, process.env.JWT_SECRET);
			// const user = await User.findById(decode.user);
			if (!decode) {
				res.status(401).json({ message: 'Not verified token' });
			}
			req._id = decode._id;
			console.log('auth', req._id);
			next();
		} catch (error) {
			res.status(401);
			res.json({ message: 'Error Autherizing' });
		}
	} else {
		res.status(401);
		res.json({ message: 'Error Autherizing' });
	}
}
export default protect;
