export class UserRepositoryFactory {
	#northUserRepository;

	constructor({northUserRepository}) {
		this.#northUserRepository = northUserRepository;
	}

	fromLocation() {
		return this.#northUserRepository;
	}
}
