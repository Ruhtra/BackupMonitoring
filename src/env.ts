import z from "zod";

const envScheme = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DB_DIR1: z.string(),
  DB_DIR2: z.string(),
  OUTPUT_DIR: z.string(),
  PATH_REMOTE: z.string(),
  SCP_USER: z.string(),
  SCP_HOST: z.string(),
  SCP_PORT: z.string(),
  BACKUP_NAMES: z
    .string()
    .transform((value) => value.split(",").map((name) => name.trim()))
    .refine((names) => new Set(names).size === names.length, {
      message: "BACKUP_NAMES must not contain duplicate names.",
    }),
  BACKUP_CRON: z.string(), // Removida a validação de expressão regular
  SSH_KEY_PATH: z.string(),
});

export const env = envScheme.parse(process.env);
