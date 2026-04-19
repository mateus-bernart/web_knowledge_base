export class ApiError extends Error {
  status: number;
  action?: string;
  constructor(message: string, status: number, action?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.action = action;
  }
}
