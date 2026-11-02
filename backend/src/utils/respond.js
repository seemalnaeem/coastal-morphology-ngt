// One response shape for the whole API. Errors are { error: { code, message } }.

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (msg) => new ApiError(400, "bad_request", msg);
export const notFound = (msg) => new ApiError(404, "not_found", msg);

export function sendOk(res, data) {
  res.json(data);
}
