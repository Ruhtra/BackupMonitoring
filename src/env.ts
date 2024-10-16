import z from "zod";

const envScheme = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = envScheme.parse(process.env);
