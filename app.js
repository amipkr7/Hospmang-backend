import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import Razorpay from 'razorpay'; // Import Razorpay as a default import
import { dbConnection } from './database/database.js';
import messageRouter from './router/messageRouter.js';
import { errorMiddleware } from './middlewares/error.js'; // Fixed typo in middlewares
import userRouter from './router/userRouter.js';
import appointmentRouter from './router/appointmentRouter.js';
import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables
config({ path: './config/config.env' });

const app = express();

// Middleware Configuration
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

// Razorpay Configuration
console.log('Razorpay Key ID:', process.env.RAZ_KEY_ID);
console.log('Razorpay Secret Key:', process.env.RAZ_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZ_KEY_ID,
  key_secret: process.env.RAZ_SECRET_KEY,
});

// Payment Endpoint
app.post('/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  if (!amount || !currency || !receipt) {
    return res.status(400).json({ error: 'Amount, currency, and receipt are required.' });
  }

  const options = {
    amount: amount * 100, // Convert to smallest currency unit
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ message: 'Health OK!' });
});

// Routes
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/appointment', appointmentRouter);

// Socket.io Configuration
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("message", (message) => {
    console.log("Received message:", message);
    socket.broadcast.emit("chatMessage", { id: socket.id, message: message });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });

  socket.emit("welcome", "Welcome to the server!");
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(process.env.PORT_SOCKET || PORT, () => {
  console.log(`Server is listening at port ${process.env.PORT_SOCKET || PORT}`);
});

// Database Connection
dbConnection();

// Global Error Middleware
app.use(errorMiddleware);

export default app;
