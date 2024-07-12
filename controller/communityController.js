import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

 const communityController = () => {
    const app = express();
    const port = process.env.PORT_SOCKET || 5001;

    // Create an HTTP server using the Express app
    const server = createServer(app);

    // Initialize Socket.IO with CORS settings
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'PUT', 'POST', 'DELETE'],
            credentials: true
        }
    });

    // Handle connections to the /community namespace
    const communityNamespace = io.of('/community');

    communityNamespace.on("connection", (socket) => {
        console.log("User Connected to /community:", socket.id);

        socket.on("message", (message) => {
            console.log("Received message:", message);

            socket.broadcast.emit("chatMessage", { id: socket.id, message: message });
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected from /community:", socket.id);
        });

        socket.emit("welcome", "Welcome to the community!");
    });

    server.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });

    server.on('error', (error) => {
        console.error('Server Error:', error);
    });
}

export default communityController;

