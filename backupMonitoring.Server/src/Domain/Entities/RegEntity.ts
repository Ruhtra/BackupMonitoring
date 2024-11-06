import { randomUUID } from "crypto";

export type RegProps = {
  id: string;
  dbName: string;
  statusBackup: "progress" | "success" | "error" | "idle";
  statusSend: "progress" | "success" | "error" | "idle";
  startBackup?: Date;
  finishBackup?: Date;
  createdAt: Date;
};

export type RegCreateProps = Pick<RegProps, "dbName">;
export type RegUpdateProps = Omit<RegProps, "id" | "dbName" | "createdAt">;

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
  update(props: RegUpdateProps) {
    Object.assign(this, props);
  }
  static with(props: RegProps) {
    return new RegEntity({
      createdAt: props.createdAt,
      dbName: props.dbName,
      id: props.id,
      startBackup: props.startBackup,
      finishBackup: props.finishBackup,
      statusBackup: props.statusBackup,
      statusSend: props.statusSend,
    });
  }

  StartProcess() {
    if (this.props.startBackup != null)
      throw new Error("Backup process has already started.");

    this.props.startBackup = new Date();
  }

  FinishProcess() {
    if (this.props.startBackup == null)
      throw new Error("Cannot finish process because it hasn't started.");
    if (this.props.finishBackup != null)
      throw new Error("Process has already been finished.");

    this.props.finishBackup = new Date();
  }

  StartBackup() {
    if (this.props.startBackup == null)
      throw new Error(
        "Cannot start backup because the backup process has not started."
      );

    this.props.statusBackup = "progress";
  }

  FinishBackup(status: "error" | "success") {
    if (this.props.startBackup == null)
      throw new Error(
        "Cannot start backup because the backup process has not started."
      );

    this.props.statusBackup = status;
  }

  StartSend() {
    if (this.props.startBackup == null)
      throw new Error(
        "Cannot start sending because the backup process has not started."
      );

    this.props.statusSend = "progress";
  }

  FinishSend(status: "error" | "success") {
    if (this.props.startBackup == null)
      throw new Error(
        "Cannot start sending because the backup process has not started."
      );
    if (this.props.statusSend !== "progress")
      throw new Error("Cannot finish send process because it hasn't started.");

    this.props.statusSend = status;
  }

  public get id(): string {
    return this.props.id;
  }

  public get statusBackup(): RegProps["statusBackup"] {
    return this.props.statusBackup;
  }
  public get statusSend(): RegProps["statusSend"] {
    return this.props.statusSend;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get dbName(): string {
    return this.props.dbName;
  }
  public get startBackup(): Date {
    return this.props.startBackup;
  }
  public get finishBackup(): Date {
    return this.props.finishBackup;
  }
}
