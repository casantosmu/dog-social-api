export const ErrorCodes = {
	TYPE_ERROR: 'TYPE_ERROR',
	USERNAME_TOO_SHORT: 'USERNAME_TOO_SHORT',
	USERNAME_TOO_LONG: 'USERNAME_TOO_LONG',
	INVALID_PASSWORD_FORMAT: 'INVALID_PASSWORD_FORMAT',
	INVALID_LATITUDE_RANGE: 'INVALID_LATITUDE_RANGE',
	INVALID_LONGITUDE_RANGE: 'INVALID_LONGITUDE_RANGE',
	INVALID_LANGUAGE_CODE: 'INVALID_LANGUAGE_CODE',
	INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
	USER_EMAIL_EXISTS: 'USER_EMAIL_EXISTS',
	USERNAME_EXISTS: 'USERNAME_EXISTS',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
};

class CoreError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
}

export class BadRequestError extends CoreError {}

export class NotFoundError extends CoreError {}

export class ConflictError extends CoreError {}
