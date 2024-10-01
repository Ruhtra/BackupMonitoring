export interface IUseCase<Input, Output> {
  exeute(input: Input): Promise<Output>;
}
