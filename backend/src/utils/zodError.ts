import { z } from "zod";

export const formatZodError = (error: z.ZodError): string => {
  const issues = error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `${path ? path + ": " : ""}${issue.message}`;
  });
  return issues.join(", ");
};