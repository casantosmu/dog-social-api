import process from 'node:process';

const environment = process.env.NODE_ENV ?? 'development';

export const config = {
	isDevelopment: environment === 'development',
	server: {
		port: Number(process.env.SERVER_PORT ?? 3000),
	},
	logger: {
		level: process.env.LOG_LEVEL ?? 'info',
	},
	postgres: {
		host: process.env.POSTGRES_HOST ?? 'localhost',
		port: Number(process.env.POSTGRES_PORT ?? 5432),
		user: process.env.POSTGRES_USER ?? 'postgres',
		password: process.env.POSTGRES_PASSWORD ?? 'postgres',
		database: process.env.POSTGRES_DB ?? 'postgres',
	},
};
