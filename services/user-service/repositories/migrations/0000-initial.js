import process from 'node:process';
import pg from 'pg';

const client = new pg.Client({
	host: process.env.POSTGRES_HOST || 'localhost',
	port: process.env.POSTGRES_PORT || 5432,
	user: process.env.POSTGRES_USER || 'postgres',
	password: process.env.POSTGRES_PASSWORD || 'postgres',
	database: process.env.POSTGRES_DB || 'postgres',
});

await client.connect();

try {
	await client.query(`
	CREATE TABLE IF NOT EXISTS users (
		user_id UUID PRIMARY KEY,
		username VARCHAR(15) UNIQUE NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		latitude NUMERIC NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
		longitude NUMERIC NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
		language CHAR(2) NOT NULL
	);
	`);
	console.log('migration "0000-initial" was executed successfully');
} catch (error) {
	console.error('failed to run "0000-initial" migration');
	console.error(error);
	process.exitCode = 1;
} finally {
	await client.end();
}
