import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    username: z
      .string("Email is required")
      .nonempty("Email must not be an empty"),
    password: z
      .string("Password is required")
      .nonempty("Password must not be an empty"),
  }),
});
