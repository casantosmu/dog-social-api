import {UserId} from './user-id.js';

export class User {
	#id;
	#username;
	#email;
	#password;
	#location;
	#language;

	get id() {
		return this.#id;
	}

	get username() {
		return this.#username;
	}

	get email() {
		return this.#email;
	}

	get password() {
		return this.#password;
	}

	get location() {
		return this.#location;
	}

	get language() {
		return this.#language;
	}

	constructor({id, username, email, password, location, language}) {
		this.#id = id ?? new UserId();
		this.#username = username;
		this.#email = email;
		this.#password = password;
		this.#location = location;
		this.#language = language;
	}
}
