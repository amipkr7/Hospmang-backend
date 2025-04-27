import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import Razorpay from "razorpay"; // Import Razorpay
import { dbConnection } from "./database/database.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import { errorMiddleware } from "./middlwares/error.js";
// import Appoinment from "./models/appointmentSchema.js";
import nodemailer from "nodemailer";


const app = express();
config({ path: "./config/config.env" }); // Load environment variables

console.log("Environment Variables:", process.env.FRONTEND_URL,process.env.DASHBOARD_URL); // Log environment variables for debugging
// Middleware Setup
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

// Razorpay Instance Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZ_KEY_ID, // Key ID from Razorpay Dashboard
  key_secret: process.env.RAZ_SECRET_KEY, // Secret Key from Razorpay Dashboard
});

// Health Check Endpoint
app.get("/health", async (req, res) => {
  res.send({ message: "Health OK!" });
});

// Razorpay Order Creation Endpoint
app.post("/create-order", async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {

    // Appointment.save({ amount, currency, receipt });
    const options = {
      amount: amount * 100, // Convert amount to smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options); // Create Razorpay order
    
    res.status(201).json(order); // Respond with order details
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

// Route Integrations
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Database Connection
dbConnection();

// Error Middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Server Export
// export default app;
