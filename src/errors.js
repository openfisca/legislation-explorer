export class HttpError extends Error {}


export class NotFound extends HttpError {
  constructor(message) {
    super(message)
    this.status = 404
  }
}
