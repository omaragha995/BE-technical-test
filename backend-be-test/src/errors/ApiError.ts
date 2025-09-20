export class ApiError extends Error {
  private statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  public getMessage() {
    return this.message;
  }

  public getStatusCode() {
    return this.statusCode;
  }
}
