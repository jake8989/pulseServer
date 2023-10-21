import express from 'express';
import cors from 'cors';
import evn from 'dotenv';
import connectDb from './config/Db';
import userRoute from './routes/userRoute';
import chatRoute from './routes/chatRoute';
// import compression from 'compression';
import bodyParser from 'body-parser';
evn.config();
const app = express();

app.use(cors());
// app.use(compression());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDb();
app.get('/test-server', (req: express.Request, res: express.Response) => {
	res.send('Hii from the server');
});
app.use(userRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/chat', chatRoute);
app.post('/test', (req: express.Request, res: express.Response) => {
	console.log(req.body);
	res.status(200).json({ message: 'Success' });
});

app.listen(8000, () => {
	console.log('server is running');
});
