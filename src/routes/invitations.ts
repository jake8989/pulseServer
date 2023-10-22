import express from 'express';
import Chat from '../models/chatModel';
const router = express.Router();
interface RequestWithUser extends express.Request {
	_id: string;
}
router.get(
	'/test-invitation',
	(req: RequestWithUser, res: express.Response) => {
		const _id = req._id;
		console.log(_id);
		res.send('/hii');
	}
);
export default router;
