export interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: T;
}

export function Success<T>(message: string, data?: T): IResponse<T> {
  return data ? { success: true, message, data } : { success: true, message };
}

export function Fail<T>(message: string, error?: T): IResponse<T> {
  return error
    ? { success: false, message, error }
    : { success: false, message };
}
