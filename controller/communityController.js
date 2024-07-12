import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';



export const communityController=()=>{


const app = express();
const port = process.env.PORT_SOCKET || 5001;


const server = createServer(app);

// Initialize Socket.IO with CORS settings
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


server.listen(port, () => {
    console.log(`Server is listening at ${port}`);
});


}




