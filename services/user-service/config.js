import process from 'node:process';

const environment = process.env.NODE_ENV ?? 'development';

export const config = {
	isDevelopment: environment === 'development',
	server: {
		port: process.env.SERVER_PORT ?? 3000,
	},
	logger: {
		level: process.env.LOG_LEVEL ?? 'info',
	},
};
