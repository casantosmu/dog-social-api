import {BadRequestError, ErrorCodes} from './error.js';

export class UserName {
	#value;

	get value() {
		return this.#value;
	}

	static #maxLength = 15;
	static #minLength = 2;

	constructor(username) {
		if (typeof username !== 'string') {
			throw new BadRequestError(ErrorCodes.TYPE_ERROR, 'Username must be a string.');
		}

		if (username.length < UserName.#minLength) {
			throw new BadRequestError(ErrorCodes.USERNAME_TOO_SHORT, `Username must be at least ${UserName.#minLength} characters long.`);
		}

		if (username.length > UserName.#maxLength) {
			throw new BadRequestError(ErrorCodes.USERNAME_TOO_LONG, `Username must not exceed ${UserName.#maxLength} characters.`);
		}

		this.#value = username;
	}
}
