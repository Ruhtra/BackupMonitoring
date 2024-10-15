export interface RegUpdateInputDto {
  id: string;
  data: {
    statusBackup: "progress" | "success" | "error";
    statusSend: "progress" | "success" | "error" | "idle";
    startBackup?: Date;
    finishBackup?: Date;
  };
}
