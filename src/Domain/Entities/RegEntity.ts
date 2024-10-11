import { randomUUID } from "crypto";

export type RegProps = {
  id: string;
  dbName: string;
  statusBackup: "progress" | "success" | "error" | "idle";
  statusSend: "progress" | "success" | "error" | "idle";
  createdAt: Date;
};

export type RegCreateProps = Pick<RegProps, "dbName">;
export type RegUpdateStatusBackupProps = Pick<RegProps, "statusBackup">;
export type RegUpdateStatusSendProps = Pick<RegProps, "statusSend">;

export class RegEntity {
  private props: RegProps;
  private constructor(props: RegProps) {
    this.props = props;
  }

  static create(props: RegCreateProps) {
    return new RegEntity({
      id: randomUUID(),
      dbName: props.dbName,
      statusSend: "idle",
      statusBackup: "idle",
      createdAt: new Date(),
    });
  }
  static with(props: RegProps) {
    return new RegEntity({
      createdAt: props.createdAt,
      dbName: props.dbName,
      id: props.id,
      statusBackup: props.statusBackup,
      statusSend: props.statusSend,
    });
  }
  updateStatusBackup(props: RegUpdateStatusBackupProps) {
    this.props.statusBackup = props.statusBackup;
  }
  updatestatusSend(props: RegUpdateStatusSendProps) {
    this.props.statusSend = props.statusSend;
  }

  public get id(): string {
    return this.props.id;
  }

  //FIX THIS TYPING
  public get statusBackup(): any {
    return this.props.statusBackup;
  }
  //FIX THIS TYPING
  public get statusSend(): any {
    return this.props.statusSend;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get dbName(): string {
    return this.props.dbName;
  }
}
