export class UserRepositoryFactory {
	#postgresUserRepository;

	constructor({postgresUserRepository}) {
		this.#postgresUserRepository = postgresUserRepository;
	}

	fromLocation() {
		return this.#postgresUserRepository;
	}
}
