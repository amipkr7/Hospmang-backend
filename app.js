import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import Razorpay from "razorpay";
import { dbConnection } from "./database/database.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/error.js"; // Fixed typo in middlewares
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables
config({ path: "./config/config.env" });

// Create Express app
const app = express();

// Middleware setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Log Razorpay keys (ensure these logs are removed or disabled in production)
console.log("Razorpay Key ID:", process.env.RAZ_KEY_ID);
console.log("Razorpay Secret Key:", process.env.RAZ_SECRET_KEY);

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZ_KEY_ID,
  key_secret: process.env.RAZ_SECRET_KEY,
});

// Razorpay order creation route
app.post("/create-order", async (req, res) => {
  const { amount, currency, receipt } = req.body;

  const options = {
    amount: amount * 100, // Convert amount to smallest currency unit
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.send({ message: "Health OK!" });
});


app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);


const server = createServer(app);


const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("message", (message) => {
    console.log("Received message:", message);
    socket.broadcast.emit("chatMessage", { id: socket.id, message });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });

  socket.emit("welcome", "Welcome to the server!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

dbConnection();

app.use(errorMiddleware);

export default app;
