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
    socket.on("message", (message) => {
        console.log("Received message:", message);
        socket.broadcast.emit("chatMessage", { id: socket.id, message: message });
    });    
    socket.on("disconnect", () => {
        console.log("User Disconnected from /community:", socket.id);
    });    
    socket.emit("welcome", "Welcome to the community!");
});

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_key,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

app.listen(process.env.PORT,()=>{
    console.log(`Port is listening on ${process.env.PORT}`);
});
