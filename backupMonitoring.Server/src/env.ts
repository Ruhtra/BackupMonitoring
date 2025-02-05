import z from "zod";

const envScheme = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),

  // backup
  //   BACKUP_NAMES: z
  //     .string()
  //     .transform((value) => value.split(",").map((name) => name.trim()))
  //     .refine((names) => new Set(names).size === names.length, {
  //       message: "BACKUP_NAMES must not contain duplicate names.",
  //     }),
  //   DAYS_TO_KEEP: z.string().transform((value) => {
  //     const num = Number(value);
  //     if (isNaN(num) || num < 0 || num > 10) {
  //       throw new Error("DAYS_TO_KEEP must be a number between 0 and 10.");
  //     }
  //     return num;
  //   }),
  //   BACKUP_CRON: z.string(),
  //   DB_DIR: z
  //     .string()
  //     .transform((value) => value.split(",").map((name) => name.trim()))
  //     .refine((names) => new Set(names).size === names.length, {
  //       message: "DB_DIR must not contain duplicate names.",
  //     }),
  //   OUTPUT_DIR: z.string(),

  //   // sendfile
  //   SEND_FILE: z.string().transform((value) => {
  //     if (value === "true" || value === "1") return true;
  //     if (value === "false" || value === "0") return false;
  //     throw new Error("SEND_FILE must be 'true', 'false', '1', or '0'.");
  //   }),
  //   PATH_REMOTE: z.string().optional(),
  //   SFTP_USER: z.string().optional(),
  //   SFTP_HOST: z.string().optional(),
  //   SFTP_PORT: z.string().optional(),
  //   SSH_KEY_PATH: z.string().optional(),
  // })
  // .refine((data) => (data.SEND_FILE ? !!data.PATH_REMOTE : true), {
  //   message: "PATH_REMOTE is required when SEND_FILE is true.",
  //   path: ["PATH_REMOTE"],
  // })
  // .refine((data) => (data.SEND_FILE ? !!data.SFTP_USER : true), {
  //   message: "SFTP_USER is required when SEND_FILE is true.",
  //   path: ["SFTP_USER"],
  // })
  // .refine((data) => (data.SEND_FILE ? !!data.SFTP_HOST : true), {
  //   message: "SFTP_HOST is required when SEND_FILE is true.",
  //   path: ["SFTP_HOST"],
  // })
  // .refine((data) => (data.SEND_FILE ? !!data.SFTP_PORT : true), {
  //   message: "SFTP_PORT is required when SEND_FILE is true.",
  //   path: ["SFTP_PORT"],
  // })
  // .refine((data) => (data.SEND_FILE ? !!data.SSH_KEY_PATH : true), {
  //   message: "SSH_KEY_PATH is required when SEND_FILE is true.",
  //   path: ["SSH_KEY_PATH"],
});

export const env = envScheme.parse(process.env);
