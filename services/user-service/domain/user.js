import {UserId} from './user-id.js';

export class User {
	#id;
	#isDeleted;

	get id() {
		return this.#id;
	}

	get isDeleted() {
		return this.#isDeleted;
	}

	constructor({id, username, email, password, location, language}) {
		this.#id = id ?? new UserId();
		this.username = username;
		this.email = email;
		this.password = password;
		this.location = location;
		this.language = language;
		this.#isDeleted = false;
	}

	delete() {
		this.#isDeleted ||= true;
	}
}
