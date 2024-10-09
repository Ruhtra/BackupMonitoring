import { randomUUID } from "crypto";

export type RegProps = {
  id: string;
  dbName: string;
  status: "progress" | "successs" | "error";
  createdAt: Date;
};

export type RegCreateProps = Pick<RegProps, "status" | "dbName">;
export type RegUpdateProps = Pick<RegProps, "status">;

export class RegEntity {
  private props: RegProps;
  private constructor(props: RegProps) {
    this.props = props;
  }

  static create(props: RegCreateProps) {
    return new RegEntity({
      createdAt: new Date(),
      dbName: props.dbName,
      id: randomUUID(),
      status: props.status,
    });
  }
  update(props: RegUpdateProps) {
    this.props.status = props.status;
  }

  public get id(): string {
    return this.props.id;
  }

  //fix this typing
  public get status(): any {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
  public get dbName(): string {
    return this.props.dbName;
  }
}
