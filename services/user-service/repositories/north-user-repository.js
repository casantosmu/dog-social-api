import {User} from '../domain/user.js';
import {UserEmail} from '../domain/user-email.js';
import {UserLanguage} from '../domain/user-language.js';
import {UserLocation} from '../domain/user-location.js';
import {UserName} from '../domain/user-name.js';
import {UserPassword} from '../domain/user-password.js';
import {UserId} from '../domain/user-id.js';

export class NorthUserRepository {
	#pool;

	constructor({pool}) {
		this.#pool = pool;
	}

	async findById(userId) {
		const sql = `
        SELECT user_id AS id, 
            username, 
            email,
			password_hash AS password,
            latitude, 
            longitude, 
            language
        FROM users 
        WHERE user_id = $1
    	;`;

		const result = await this.#pool.query(sql, [userId]);
		const user = result.rows[0];

		if (!user) {
			return undefined;
		}

		const id = new UserId(user.id);
		const username = new UserName(user.username);
		const email = new UserEmail(user.email);
		const password = new UserPassword(user.password, true);
		const location = new UserLocation(Number(user.latitude), Number(user.longitude));
		const language = new UserLanguage(user.language);

		return new User({
			id, username, email, password, location, language,
		});
	}

	async existsById(userId) {
		const sql = 'SELECT EXISTS( SELECT 1 FROM users WHERE user_id = $1 )';
		const result = await this.#pool.query(sql, [userId]);
		return Boolean(result.rows[0].exists);
	}

	async existsByEmail(email) {
		const sql = 'SELECT EXISTS( SELECT 1 FROM users WHERE email = $1 )';
		const result = await this.#pool.query(sql, [email]);
		return Boolean(result.rows[0].exists);
	}

	async existsByUserName(username) {
		const sql = 'SELECT EXISTS( SELECT 1 FROM users WHERE username = $1 )';
		const result = await this.#pool.query(sql, [username]);
		return Boolean(result.rows[0].exists);
	}

	async save(user) {
		const sql = `
		INSERT INTO users (
			user_id, username, email, password_hash, 
			latitude, longitude, language
		) 
		VALUES (
			$1, $2, $3, $4, $5, $6, $7
		)
		ON CONFLICT (user_id) DO UPDATE 
		SET 
			username = EXCLUDED.username,
			email = EXCLUDED.email,
			password_hash = EXCLUDED.password_hash,
			latitude = EXCLUDED.latitude,
			longitude = EXCLUDED.longitude,
			language = EXCLUDED.language
		;`;
		const passwordHash = await user.password.getHashed();
		const values = [
			user.id.value,
			user.username.value,
			user.email.value,
			passwordHash,
			user.location.value.latitude,
			user.location.value.longitude,
			user.language.value,
		];
		await this.#pool.query(sql, values);
	}

	async delete(user) {
		if (!user.isDeleted) {
			throw new Error('User must be marked as deleted to perform this operation.');
		}

		const sql = 'DELETE FROM users WHERE user_id = $1';
		await this.#pool.query(sql, [user.id.value]);
	}
}
