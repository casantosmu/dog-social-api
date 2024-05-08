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

	async fromUserId(userId) {
		const existsInNorth = await this.#northUserRepository.existsById(userId);
		if (existsInNorth) {
			return this.#northUserRepository;
		}

		const existsInSouth = await this.#southUserRepository.existsById(userId);
		if (existsInSouth) {
			return this.#southUserRepository;
		}

		return undefined;
	}
}
