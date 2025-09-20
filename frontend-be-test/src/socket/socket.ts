// src/socket.ts
import { io } from "socket.io-client";

// connect to backend server
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"], // ensures fast connection
  reconnection: true, // enable reconnection
  reconnectionAttempts: Infinity, // keep trying until success
  reconnectionDelay: 1000,
});

export default socket;
