import { Router } from "express";

import { getCurrentExam } from "../controllers/studentController";

const router = Router();

router.get("/current", getCurrentExam);

export default router;
