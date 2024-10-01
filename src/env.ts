import z from "zod";

const envScheme = z.object({
  PORT: z.string(),
});

export const env = envScheme.parse(process.env);
