import express from 'express';
import cors from 'cors';
import evn from 'dotenv';
import connectDb from './config/Db';
import userRoute from './routes/userRoute';
import chatRoute from './routes/chatRoute';
import http from 'http';
import bodyParser from 'body-parser';
import protect from './middlewares/auth';
import invitationRoutes from './routes/invitations';
import { Server, Socket } from 'socket.io';
import User from './models/user';
evn.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRoute);
// app.use(protect);
app.use('/auth/v1', protect, invitationRoutes);
app.use('/api/v1/users', userRoute);
app.use('/auth/v1/chat', chatRoute);
app.post('/test', (req: express.Request, res: express.Response) => {
	console.log(req.body);
	res.status(200).json({ message: 'Success' });
});
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

let users: Array<{ user_id: string; socket_id: string }> = [];
const addUsers = (user_id: string, socket_id: string) => {
	if (!user_id) return;
	!users.some((user) => user.user_id === user_id) &&
		users.push({ user_id, socket_id });
};
const removeuser = (socket_id: string) => {
	users = users.filter((user) => user.socket_id !== socket_id);
};
const getUser = (user_id: string) => {
	return users.find((user) => user.user_id === user_id);
};
io.on('connection', (socket: Socket) => {
	console.log('A user Connected', socket.id);

	socket.on('addUser', (user_id) => {
		addUsers(user_id, socket.id);
		io.emit('getUsers', users);
	});
	//send and get message

	socket.on('send-message', async ({ sender_id, receiver_id, content }) => {
		const receiverUser = getUser(receiver_id);
		const sender = await User.findById(sender_id);

		io.to(receiverUser?.socket_id).emit('get-message', {
			sender_id,
			senderUsername: sender.username,
			content,
		});
	});
	socket.on('disconnect', () => {
		console.log('A user disconnected');
		removeuser(socket.id);
		io.emit('getUsers', users);
	});
});
connectDb().then(() => {
	server.listen(8000, () => {
		console.log('server is running');
	});
});
