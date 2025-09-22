class ApiError extends Error {
  constructor(
    statusCode = 500, //HTTP status code (defaults to 500 – Internal Server Error).
    message = "Something went wrong",
    error = [], //Additional error details (usually an array or object).
    stack = "" //Optional custom stack trace
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ApiError;
