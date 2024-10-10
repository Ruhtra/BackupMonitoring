import { randomUUID } from "crypto";

export type RegProps = {
  id: string;
  dbName: string;
  status: "progress" | "successs" | "error";
  statusSsh: "progress" | "successs" | "error" | "idle";
  createdAt: Date;
};

export type RegCreateProps = Pick<RegProps, "status" | "dbName" | "statusSsh">;
export type RegUpdateStatusProps = Pick<RegProps, "status">;
export type RegUpdateStatusSshProps = Pick<RegProps, "statusSsh">;

export class RegEntity {
  private props: RegProps;
  private constructor(props: RegProps) {
    this.props = props;
  }

  static create(props: RegCreateProps) {
    return new RegEntity({
      createdAt: new Date(),
      dbName: props.dbName,
      statusSsh: props.statusSsh,
      id: randomUUID(),
      status: props.status,
    });
  }
  updateStatus(props: RegUpdateStatusProps) {
    this.props.status = props.status;
  }
  updateStatusSsh(props: RegUpdateStatusSshProps) {
    this.props.statusSsh = props.statusSsh;
  }

  public get id(): string {
    return this.props.id;
  }

  //FIX THIS TYPING
  public get status(): any {
    return this.props.status;
  }
  //FIX THIS TYPING
  public get statusSsh(): any {
    return this.props.statusSsh;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get dbName(): string {
    return this.props.dbName;
  }
}
