import {httpStatusCode} from '@dog-social-api/express-lib';
import {User} from '../domain/user.js';
import {UserName} from '../domain/user-name.js';
import {UserEmail} from '../domain/user-email.js';
import {UserPassword} from '../domain/user-password.js';
import {UserLocation} from '../domain/user-location.js';
import {UserLanguage} from '../domain/user-language.js';
import {UserId} from '../domain/user-id.js';

export class SouthUserRepository {
	#baseUrl;
	#apiKey;
	#timeout;

	constructor({baseUrl, apiKey, timeout}) {
		this.#baseUrl = baseUrl;
		this.#apiKey = apiKey;
		this.#timeout = timeout;
	}

	async findById(userId) {
		const user = await this.#findById(userId);

		if (!user) {
			return undefined;
		}

		const id = new UserId(user.id);
		const username = new UserName(user.username);
		const email = new UserEmail(user.email);
		const password = new UserPassword(user.password, true);
		const location = new UserLocation(user.latitude, user.longitude);
		const language = new UserLanguage(user.language);

		return new User({
			id, username, email, password, location, language,
		});
	}

	async existsById(userId) {
		return Boolean(await this.#findById(userId));
	}

	async existsByEmail(email) {
		const result = await this.#getUsers({email});
		return result.users.length > 0;
	}

	async existsByUserName(username) {
		const result = await this.#getUsers({username});
		return result.users.length > 0;
	}

	async save(user) {
		const userExists = await this.existsById(user.id.value);

		const url = new URL(userExists ? `/v1/users/${user.id.value}` : '/v1/users', this.#baseUrl);
		const method = userExists ? 'PUT' : 'POST';
		const body = {
			username: user.username.value,
			email: user.email.value,
			password: user.password.value,
			latitude: user.location.value.latitude,
			longitude: user.location.value.longitude,
			language: user.language.value,
		};

		if (!userExists) {
			body.id = user.id.value;
		}

		const response = await fetch(url, {
			method,
			body: JSON.stringify(body),
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

	async #findById(userId) {
		const url = new URL(`/v1/users/${userId}`, this.#baseUrl);

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.#apiKey}`,
				Accept: 'application/json',
			},
			signal: AbortSignal.timeout(this.#timeout),
		});

		if (response.status === httpStatusCode.notFound) {
			const error = await response.json();
			if (error.code === 'USER_NOT_FOUND') {
				return undefined;
			}
		}

		if (!response.ok) {
			throw new Error('Unexpected response from server');
		}

		return response.json();
	}

	async #getUsers({username, email}) {
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

	async delete(user) {
		if (!user.isDeleted) {
			throw new Error('User must be marked as deleted to perform this operation.');
		}

		const url = new URL(`/v1/users/${user.id.value}`, this.#baseUrl);

		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${this.#apiKey}`,
				Accept: 'application/json',
			},
			signal: AbortSignal.timeout(this.#timeout),
		});

		if (!response.ok) {
			throw new Error('Unexpected response from server');
		}
	}
}
