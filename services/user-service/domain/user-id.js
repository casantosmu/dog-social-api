import crypto from 'node:crypto';

export class UserId {
	#value;

	get value() {
		return this.#value;
	}

	constructor(id = crypto.randomUUID()) {
		this.#value = id;
	}
}
