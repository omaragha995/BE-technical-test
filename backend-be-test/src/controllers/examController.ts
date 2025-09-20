import { Request, Response } from "express";
import { ExamService } from "../services/examService";
import students from "../data/students"; // sample in-memory students
import { Exam } from "../models/exam";
import { Student } from "../models/student";

import { sendSuccess, sendError } from "../utils/response/helper";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";

import trainees from "../data/trainees";

export const getAvailableStudents = (req: Request, res: Response) => {
  try {
    // get only available students
    const availableStudents = students.filter((student) => {
      let isStudentAvailable = true;
      for (const [examId, exam] of ExamService.getExams()) {
        isStudentAvailable =
          exam.students.findIndex((s) => s.id === student.id) === -1;

        if (!isStudentAvailable) break;
      }

      return isStudentAvailable;
    });

    sendSuccess(res, availableStudents, "Getting students successfully.");
  } catch (error) {
    sendError(res, error, "Failed to getting students");
  }
};

export const getExams = (req: Request, res: Response) => {
  const exams: Array<Exam> = Array.from(ExamService.getExams().values());

  sendSuccess(res, exams, "Getting exams successfully.");
};

export const getCurrentExam = (req: Request, res: Response) => {
  const cookies = req.headers.cookie?.split(";");

  const cookiesObj: any = {};

  cookies?.forEach((cookie) => {
    const tempCookie = cookie.trim().split("=");

    cookiesObj[tempCookie[0]] = decodeURIComponent(tempCookie[1]);
  });

  let exams = Array.from(ExamService.getExams().values());

  exams = exams.filter((exam) => {
    return exam.trainee.toLowerCase() === cookiesObj["username"].toLowerCase();
  });

  sendSuccess(
    res,
    Array.isArray(exams) ? exams[0] : {},
    "Getting current exam status"
  );
};

export const createExam = (req: Request, res: Response) => {
  const { title, duration, studentIds } = req.body;

  const selectedStudents = students.filter((s: Student) =>
    studentIds.includes(s.id)
  );

  const durationSeconds = duration * 60 * 60;

  const exam: Exam = {
    id: `exam_${Date.now()}`,
    trainee: trainees[0].email,
    title,
    duration: durationSeconds,
    remaining: durationSeconds,
    running: false,
    lastUpdate: Date.now(),
    students: selectedStudents,
    individualAdjustments: {},
  };

  ExamService.createExam(exam);

  sendSuccess(res, exam, "Exam created successfully.", 201);
};

export const startExam = (req: Request, res: Response) => {
  const { examId } = req.params;
  const exam = ExamService.getExam(examId);
  if (!exam) throw new NotFoundError("Exam not found");
  if (exam.running) throw new BadRequestError("Exam already started");

  ExamService.startExam(examId);
  sendSuccess(res, exam, "Exam started");
};

export const pauseExam = (req: Request, res: Response) => {
  const { examId } = req.params;
  const exam = ExamService.getExam(examId);
  if (!exam) throw new NotFoundError("Exam not found");
  if (!exam.running) throw new BadRequestError("Exam already paused");

  ExamService.pauseExam(examId);
  sendSuccess(res, exam, "Exam paused");
};

export const resetExam = (req: Request, res: Response) => {
  const { examId } = req.params;
  const exam = ExamService.getExam(examId);
  if (!exam) throw new NotFoundError("Exam not found");

  ExamService.resetExam(examId);
  sendSuccess(res, {}, "Exam reset");
};

export const adjustTime = (req: Request, res: Response) => {
  const { examId } = req.params;

  const exam = ExamService.getExam(examId);
  if (!exam) throw new NotFoundError("Exam not found");

  const { seconds, studentId } = req.body;

  if (typeof seconds !== "number") {
    return res.status(400).json({ error: "seconds must be a number" });
  }

  ExamService.adjustTime(examId, seconds, studentId);
  sendSuccess(res, { studentId, seconds }, "Time adjusted");
};
