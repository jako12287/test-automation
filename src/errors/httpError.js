export class HttpError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const createHttpError = (statusCode, message, details) => {
  return new HttpError(message, statusCode, details);
};
