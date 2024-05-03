export class PostgresUserRepository {
	#pool;

	constructor({pool}) {
		this.#pool = pool;
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
        INSERT INTO users(
            user_id, username, email, password_hash, 
            latitude, longitude, language
          ) 
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7)
        `;
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
}
