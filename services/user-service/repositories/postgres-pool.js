import pg from 'pg';

export class PostgresPool {
	#pool;
	#logger;

	constructor({host, port, user, password, database, logger}) {
		this.#pool = new pg.Pool({
			host, port, user, password, database,
		});
		this.#logger = logger;
	}

	async start() {
		try {
			await this.query('SELECT 1+1');
			this.#logger.info('Postgres successfully started');
		} catch (error) {
			throw new Error('Postgres start error', {cause: error});
		}
	}

	async stop() {
		try {
			await this.#pool.end();
			this.#logger.info('Postgres successfully stopped');
		} catch (error) {
			throw new Error('Postgres stop error', {cause: error});
		}
	}

	async query(text, parameters) {
		const start = Date.now();
		const result = await this.#pool.query(text, parameters);
		const duration = Date.now() - start;
		this.#logger.debug('Executed query', {text, duration, rows: result.rowCount});
		return result;
	}
}
