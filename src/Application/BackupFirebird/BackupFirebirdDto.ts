import { RegEntity } from "../../Domain/Entities/RegEntity";

export interface BackupFirebirdInputDto {
  cb: () => Promise<void>;
}
