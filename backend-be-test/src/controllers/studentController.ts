import { Request, Response } from "express";

import { ExamService } from "../services/examService";
import { sendSuccess } from "../utils/response/helper";

export const getCurrentExam = (req: Request, res: Response) => {
  const cookies = req.headers.cookie?.split(";");

  const cookiesObj: any = {};

  cookies?.forEach((cookie) => {
    const tempCookie = cookie.trim().split("=");

    cookiesObj[tempCookie[0]] = decodeURIComponent(tempCookie[1]);
  });

  let exams = Array.from(ExamService.getExams().values());

  console.log(exams);

  exams = exams.filter((exam) => {
    const idx = exam.students.findIndex((student) => {
      student.email.toLowerCase() === cookiesObj["username"].toLowerCase();
      return (
        student.email.toLowerCase() === cookiesObj["username"].toLowerCase()
      );
    });

    return idx != -1;
  });

  sendSuccess(
    res,
    Array.isArray(exams) ? exams[0] : {},
    "Getting current exam status"
  );
};
