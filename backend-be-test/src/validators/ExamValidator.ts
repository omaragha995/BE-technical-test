import { z } from "zod";

export const CreateExamSchema = z.object({
  body: z.object({
    title: z.string("Title is required").nonempty("Title must not be an empty"),
    duration: z
      .number("Duration must be a number")
      .positive("Duration must be greater than 0"),
    studentIds: z
      .array(z.number(), "Students must be an array")
      .nonempty("At least one student is required"),
  }),
});

export const AdjustTimeSchema = z.object({
  body: z.object({
    seconds: z.number("Duration must be a number"),
    studentIds: z.string("").optional(),
  }),
  params: z.object({
    examId: z.string().min(1, "Exam ID is required"),
  }),
});
