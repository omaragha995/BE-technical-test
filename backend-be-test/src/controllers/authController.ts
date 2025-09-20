import { Request, Response } from "express";

import students from "../data/students";
import trainees from "../data/trainees";
import { BadRequestError } from "../errors/BadRequestError";
import { sendSuccess } from "../utils/response/helper";

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  let type = "";

  if (password != "123456") {
    throw new BadRequestError("invalid credentials");
  }

  let idx = students.findIndex((student) => {
    return student.email.toLowerCase() === username.toLowerCase();
  });

  if (idx != -1) type = "student";
  else {
    idx = trainees.findIndex((trainee) => {
      return trainee.email.toLowerCase() === username.toLowerCase();
    });

    if (idx != -1) {
      type = "trainee";
    } else {
      throw new BadRequestError("invalid credentials");
    }
  }

  res.cookie("username", username.toLowerCase(), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("loggedIn", "true", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("type", type, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, [], "Logged in successfully");
};
