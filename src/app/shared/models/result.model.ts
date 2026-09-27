export interface Result<T> {
  isSuccess: boolean;
  value: T;
  errorMessage: string;
}