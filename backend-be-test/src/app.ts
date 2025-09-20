import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

import examRoutes from "./routes/examRoutes";
import studentRoutes from "./routes/studentRoutes";
import authRoutes from "./routes/authRoutes";
import { initExamService } from "./services/examService";
import { errorHandler } from "./errors/ErrorHandler";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8080", // your Vue dev server
    credentials: true,
  })
);

// auth routes
app.use("/auth", authRoutes);

// exam routes
app.use("/exams", examRoutes);

// students routes
app.use("/students", studentRoutes);

// Create Socket.IO server
const io = new Server(server, {
  cors: { origin: "http://localhost:8080", credentials: true },
});

// Initialize ExamService with Socket.IO
initExamService(io);

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("joinExam", (examId: string) => {
    socket.join(examId);
    console.log(`Client ${socket.id} joined exam ${examId}`);
  });

  socket.on("leaveExam", (examId: string) => {
    socket.leave(examId);
    console.log(`Client ${socket.id} left exam ${examId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// global error handling middleware
app.use(errorHandler);

// Start server
server.listen(3000, () => {
  console.log("🚀 Server listening on http://localhost:3000");
});
