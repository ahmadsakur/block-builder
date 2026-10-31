import { z } from "zod";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export const projectInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a project name.")
    .max(80, "Keep it under 80 characters."),
});
export type ProjectInput = z.infer<typeof projectInputSchema>;
