import argon2 from 'argon2';
import {BadRequestError, ErrorCodes} from './error.js';

export class UserPassword {
	#value;
	#isHashed;

	get value() {
		return this.#value;
	}

	/**
     * Regular expression for password validation.
     *
     * This regular expression is based on OWASP Validation Regex Repository:
     * https://owasp.org/www-community/OWASP_Validation_Regex_Repository
     */
	static #passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/;

	constructor(password, isHashed = false) {
		if (typeof password !== 'string') {
			throw new BadRequestError(ErrorCodes.TYPE_ERROR, 'Password must be a string.');
		}

		if (!isHashed && !UserPassword.#passwordPattern.test(password)) {
			throw new BadRequestError(ErrorCodes.INVALID_PASSWORD_FORMAT, 'Password must be 4 to 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number.');
		}

		this.#value = password;
		this.#isHashed = isHashed;
	}

	async getHashed() {
		if (!this.#isHashed) {
			return argon2.hash(this.value);
		}

		return this.value;
	}
}
