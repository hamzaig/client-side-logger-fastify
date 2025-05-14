import { z } from "zod";

export const logSchema = z.object({
  level: z.string().trim().min(1),
  url: z.string().url().optional(),
  message: z.string().trim().min(1),
  applicationName: z.string().trim().min(2),
  userAgent: z.string().optional(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid timestamp",
  }),
});
