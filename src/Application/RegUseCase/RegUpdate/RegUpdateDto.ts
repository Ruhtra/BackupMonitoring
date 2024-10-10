export interface RegUpdateInputDto {
  id: string;
  data: {
    statusBackup: "progress" | "successs" | "error";
    statusSend: "progress" | "successs" | "error" | "idle";
  };
}
