import z from "zod";

const cronRegex =
  /^(?:(\*|([0-5]?\d))\s+)?(\*|([01]?\d|2[0-3]))\s+(\*|([1-9]|[12]\d|3[01]))\s+(\*|([1-9]|1[0-2]|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))\s+(\*|([0-7]|mon|tue|wed|thu|fri|sat|sun))(?:\s+(\*|([0-5]?\d)))?$/;

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
  BACKUP_CRON: z.string().refine((value) => cronRegex.test(value), {
    message: "BACKUP_CRON is not a valid cron expression.",
  }),
  SSH_KEY_PATH: z.string(),
});

export const env = envScheme.parse(process.env);
