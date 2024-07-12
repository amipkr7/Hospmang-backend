import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

export const communityController = () => {
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

        // Handle incoming messages from clients
        socket.on("message", (message) => {
            console.log("Received message:", message);

            // Broadcast the message to all connected clients except the sender
            socket.broadcast.emit("chatMessage", { id: socket.id, message: message });
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User Disconnected from /community:", socket.id);
        });

        // Send a welcome message to the connected client
        socket.emit("welcome", "Welcome to the community!");
    });

    // Start the server
    server.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });

    // Error handling for the server
    server.on('error', (error) => {
        console.error('Server Error:', error);
    });
}

