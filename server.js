import app from './app.js';
import cloudinary from 'cloudinary';
import { createServer } from 'http';
import { Server } from 'socket.io';



// Initialize Socket.IO with CORS settings
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

    // Handle incoming messages from clients
    socket.on("message", (message) => {
        console.log("Received message:", message);

        // Broadcast the message to all connected clients except the sender
        socket.broadcast.emit("chatMessage", { id: socket.id, message: message });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });

    // Send a welcome message to the connected client
    socket.emit("welcome", "Welcome to the server!");
});
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_key,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

app.listen(process.env.PORT,()=>{
    console.log(`Port is listening on ${process.env.PORT}`);
});
