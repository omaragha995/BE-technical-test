import { Server } from "socket.io";
import { Exam } from "../models/exam";

class ExamServiceClass {
  private exams: Map<string, Exam> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    setInterval(() => {
      this.updateRunningExams();
    }, 1000);
  }

  private updateRunningExams() {
    this.exams.forEach((exam, examId) => {
      if (exam.running) {
        this.updateRemainingTime(exam); // calculate new remaining time
        this.broadcastUpdate(examId); // emit updated exam to all clients
      }
    });
  }

  getExams(): Map<string, Exam> {
    return this.exams;
  }

  createExam(exam: Exam) {
    this.exams.set(exam.id, exam);
  }

  getExam(examId: string): Exam | undefined {
    return this.exams.get(examId);
  }

  startExam(examId: string) {
    const exam = this.exams.get(examId);
    if (!exam || exam.running) return;
    exam.running = true;
    exam.lastUpdate = Date.now();
    this.broadcastUpdate(examId);
  }

  pauseExam(examId: string) {
    const exam = this.exams.get(examId);
    if (!exam || !exam.running) return;
    this.updateRemainingTime(exam);
    exam.running = false;
    this.broadcastUpdate(examId);
  }

  resetExam(examId: string) {
    const exam = this.exams.get(examId);
    if (!exam) return;
    exam.remaining = exam.duration;
    exam.running = false;
    exam.individualAdjustments = {};
    this.broadcastUpdate(examId);
  }

  adjustTime(examId: string, seconds: number, studentId?: string) {
    const exam: Exam = this.exams.get(examId) as Exam;
    if (!exam) return;
    if (studentId) {
      exam.individualAdjustments[studentId] =
        (exam.individualAdjustments[studentId] || 0) + seconds;
    } else {
      exam.remaining += seconds;
    }
    this.broadcastUpdate(examId, studentId);
  }

  private updateRemainingTime(exam: Exam) {
    if (!exam.running) return;
    const elapsed = Math.floor((Date.now() - exam.lastUpdate) / 1000);
    exam.remaining = Math.max(exam.remaining - elapsed, 0);
    exam.lastUpdate = Date.now();
  }

  private broadcastUpdate(examId: string, studentId?: string) {
    const exam = this.exams.get(examId);
    if (!exam) return;
    console.log("broadcast ::: ", examId);
    this.io.to(examId).emit("examUpdate", exam);
  }
}

export let ExamService: ExamServiceClass;
export const initExamService = (io: Server) => {
  ExamService = new ExamServiceClass(io);
};
