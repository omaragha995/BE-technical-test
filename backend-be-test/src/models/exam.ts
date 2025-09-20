import { Student } from "./student";

export interface Exam {
  id: string;
  trainee: string;
  title: string;
  duration: number; // total duration in seconds
  remaining: number; // remaining time in seconds
  running: boolean;
  lastUpdate: number; // timestamp of last update
  students: Array<Student>; // all students in the exam.
  individualAdjustments: Record<string, number>; // per student adjustments
}
