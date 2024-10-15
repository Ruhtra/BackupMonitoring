export interface SendOptions {
  fileNames: string[];
  onSuccess: (dbName: string) => Promise<void>;
  onFail: (dbName: string, error: Error | number) => Promise<void>;
  onProgress: (dbName: string, percentage: string) => void;
}

export interface ISendService {
  execute(options: SendOptions): Promise<void>;
}
