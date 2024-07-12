import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import Razorpay from 'razorpay'; // Import Razorpay as a default import
import { dbConnection } from './database/database.js';
import messageRouter from './router/messageRouter.js';
import { errorMiddleware } from './middlwares/error.js'; // Fixed typo in middlewares
import userRouter from './router/userRouter.js';
import appointmentRouter from './router/appointmentRouter.js';
import { communityController } from './controller/communityController.js';


const app = express();
config({ path: './config/config.env' });

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
console.log('Razorpay Key ID:', process.env.RAZ_KEY_ID);
console.log('Razorpay Secret Key:', process.env.RAZ_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZ_KEY_ID,
  key_secret: process.env.RAZ_SECRET_KEY,
});

app.post('/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get('/health', async (req, res) => {
  res.send({
    message: 'Health OK!'
  });
});

app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/appointment', appointmentRouter);
app.use('/community',communityController);

dbConnection();

app.use(errorMiddleware);

export default app;
