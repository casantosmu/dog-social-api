export class UserRepositoryFactory {
	#northUserRepository;
	#southUserRepository;

	constructor({northUserRepository, southUserRepository}) {
		this.#northUserRepository = northUserRepository;
		this.#southUserRepository = southUserRepository;
	}

	fromLocation(location) {
		if (location.isNorthernHemisphere()) {
			return this.#northUserRepository;
		}

		return this.#southUserRepository;
	}
}
