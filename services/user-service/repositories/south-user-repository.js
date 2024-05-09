import {HttpStatusCodes} from '@dog-social-api/express-lib';
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
	#logger;

	constructor({baseUrl, apiKey, timeout, logger}) {
		this.#baseUrl = baseUrl;
		this.#apiKey = apiKey;
		this.#timeout = timeout;
		this.#logger = logger;
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

	async insert(user) {
		const body = {
			id: user.id.value,
			username: user.username.value,
			email: user.email.value,
			password: user.password.value,
			latitude: user.location.value.latitude,
			longitude: user.location.value.longitude,
			language: user.language.value,
		};

		const response = await this.#request('/v1/users', 'POST', body);

		if (!response.ok) {
			throw new Error(`Failed to insert user: ${response.statusText}`);
		}
	}

	async update(user) {
		const body = {
			username: user.username.value,
			email: user.email.value,
			password: user.password.value,
			latitude: user.location.value.latitude,
			longitude: user.location.value.longitude,
			language: user.language.value,
		};

		const response = await this.#request(`/v1/users/${user.id.value}`, 'PUT', body);

		if (!response.ok) {
			throw new Error(`Failed to update user: ${response.statusText}`);
		}
	}

	async delete(user) {
		if (!user.isDeleted) {
			throw new Error('User must be marked as deleted to perform this operation.');
		}

		const response = await this.#request(`/v1/users/${user.id.value}`, 'DELETE');

		if (!response.ok) {
			throw new Error(`Failed to delete user: ${response.statusText}`);
		}
	}

	async #findById(userId) {
		const response = await this.#request(`/v1/users/${userId}`, 'GET');

		if (response.status === HttpStatusCodes.NOT_FOUND) {
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

		const response = await this.#request(url, 'GET');

		if (!response.ok) {
			throw new Error('Unexpected response from server');
		}

		return response.json();
	}

	async #request(path, method, body = null) {
		const url = new URL(path, this.#baseUrl);
		const options = {
			method,
			headers: {
				Authorization: `Bearer ${this.#apiKey}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			signal: AbortSignal.timeout(this.#timeout),
		};
		if (body) {
			options.body = JSON.stringify(body);
		}

		this.#logger.debug(`Request: Sending ${method} request to ${url}`);
		return fetch(url, options);
	}
}
