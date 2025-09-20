import { Router } from "express";

import {
  createExam,
  getCurrentExam,
  startExam,
  pauseExam,
  resetExam,
  adjustTime,
  getExams,
  getAvailableStudents,
} from "../controllers/examController";
import { validate } from "../middleware/validate";
import {
  AdjustTimeSchema,
  CreateExamSchema,
} from "../validators/ExamValidator";

const router = Router();

router.post("/", validate(CreateExamSchema), createExam);
router.get("/", getExams);
router.get("/current", getCurrentExam);
router.get("/available-students", getAvailableStudents);
router.get("/:examId/start", startExam);
router.get("/:examId/pause", pauseExam);
router.get("/:examId/reset", resetExam);
router.post("/:examId/adjust-time", validate(AdjustTimeSchema), adjustTime);

export default router;
