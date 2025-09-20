import { Router } from "express";

import { getCurrentExam } from "../controllers/studentController";

const router = Router();

router.get("/", getCurrentExam);

export default router;
