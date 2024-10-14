export interface SendOptions {
  fileNames: string[];
  onSuccess: (dbName: string) => void;
  onProgress: (dbName: string, percentage: string) => void;
  onFail: (dbName: string, error: Error | number) => void;
}

export interface ISendService {
  execute(options: SendOptions): Promise<void>;
}
