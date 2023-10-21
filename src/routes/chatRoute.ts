import express from 'express';
import Chat from '../models/chatModel';
const router = express.Router();

router.get('/test-chat', (req: express.Request, res: express.Response) => {
	res.send('/hii');
});
router.post('/accessChat', (req: express.Request, res: express.Response) => {
	// res.send('/hii');
});
router.get('/fetchChat', (req: express.Request, res: express.Response) => {
	res.send('/hii');
});
router.post(
	'/group/createGroupChat',
	(req: express.Request, res: express.Response) => {
		res.send('/hii');
	}
);
router.put(
	'/groupremove/removeFromGroup',
	(req: express.Request, res: express.Response) => {
		res.send('/hii');
	}
);
router.put(
	'/groupadd/addToGroup',
	(req: express.Request, res: express.Response) => {
		res.send('/hii');
	}
);

export default router;
