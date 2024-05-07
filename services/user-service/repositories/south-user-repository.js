export class SouthUserRepository {
	#baseUrl;
	#apiKey;
	#timeout;

	constructor({baseUrl, apiKey, timeout}) {
		this.#baseUrl = baseUrl;
		this.#apiKey = apiKey;
		this.#timeout = timeout;
	}

	async getUsers({username, email}) {
		const url = new URL('/v1/users', this.#baseUrl);

		if (username) {
			url.searchParams.append('username', username);
		}

		if (email) {
			url.searchParams.append('email', email);
		}

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.#apiKey}`,
				Accept: 'application/json',
			},
			signal: AbortSignal.timeout(this.#timeout),
		});

		if (!response.ok) {
			throw new Error('Unexpected response from server');
		}

		return response.json();
	}

	async existsByEmail(email) {
		const result = await this.getUsers({email});
		return result.users.length > 0;
	}

	async existsByUserName(username) {
		const result = await this.getUsers({username});
		return result.users.length > 0;
	}

	async save(user) {
		const url = new URL('/v1/users', this.#baseUrl);

		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				id: user.id.value,
				username: user.username.value,
				email: user.email.value,
				password: user.password.value,
				latitude: user.location.value.latitude,
				longitude: user.location.value.longitude,
				language: user.language.value,
			}),
			headers: {
				Authorization: `Bearer ${this.#apiKey}`,
				'Content-Type': 'application/json',
			},
			signal: AbortSignal.timeout(this.#timeout),
		});

		if (!response.ok) {
			throw new Error('Unexpected response from server');
		}
	}
}
