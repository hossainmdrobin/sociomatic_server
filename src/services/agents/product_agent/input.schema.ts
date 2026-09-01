import { z } from "zod";

export const productInputSchema = z.object({
  url: z.string().url(),
  instituteId: z.string(),
  uploadedBy: z.string(),
});
