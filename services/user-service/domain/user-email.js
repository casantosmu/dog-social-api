import {BadRequestError, ErrorCodes} from './error.js';

export class UserEmail {
	#value;

	get value() {
		return this.#value;
	}

	/**
     * Regular expression for email validation.
     *
     * This regular expression is based on OWASP Validation Regex Repository:
     * https://owasp.org/www-community/OWASP_Validation_Regex_Repository
     */
	static #emailPattern = /^[\w+&*-]+(?:\.[\w+&*-]+)*@(?:[a-zA-Z\d-]+\.)+[a-zA-Z]{2,}$/;

	constructor(email) {
		if (typeof email !== 'string') {
			throw new BadRequestError(ErrorCodes.TYPE_ERROR, 'Email must be a string.');
		}

		if (!UserEmail.#emailPattern.test(email)) {
			throw new BadRequestError(ErrorCodes.INVALID_EMAIL_FORMAT, 'Invalid email format.');
		}

		this.#value = email;
	}
}
