import { HttpData } from './extended-response';

class HttpError extends Error {
	public constructor(
		public readonly status: number,
		message: string,
		public readonly data?: HttpData
	) {
		super(message);
	}
}

export class HttpBadRequestError extends HttpError {
	public constructor(message = 'Bad request', data?: HttpData) {
		super(400, message, data);
	}
}

export class HttpUnauthorizedError extends HttpError {
	public constructor(message = 'Unauthorized', data?: HttpData) {
		super(400, message, data);
	}
}

export class HttpNotFoundError extends HttpError {
	public constructor(message = 'Not found', data?: HttpData) {
		super(404, message, data);
	}
}

export class HttpConflictError extends HttpError {
	public constructor(message = 'Conflict', data?: HttpData) {
		super(409, message, data);
	}
}

export default HttpError;
