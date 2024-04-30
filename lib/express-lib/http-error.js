export class HttpError extends Error {
	constructor(statusCode, code, message, {cause} = {}) {
		super(message, {cause});
		this.statusCode = statusCode;
		this.code = code;
	}
}
