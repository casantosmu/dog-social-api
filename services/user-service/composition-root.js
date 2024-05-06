import {AsyncLocalStorage} from 'node:async_hooks';
import {createServer} from '@dog-social-api/express-lib';
import {PinoLogger} from '@dog-social-api/logger-lib';
import {config} from './config.js';
import {createApp} from './express/app.js';
import {PostgresPool} from './repositories/postgres-pool.js';

const context = new AsyncLocalStorage();

export const logger = new PinoLogger({
	name: 'user-service',
	level: config.logger.level,
	pretty: config.isDevelopment,
	context,
});

export const postgresPool = new PostgresPool({
	host: config.postgres.host,
	port: config.postgres.port,
	user: config.postgres.user,
	password: config.postgres.password,
	database: config.postgres.database,
	logger,
});

const app = createApp({logger, context});

export const server = createServer({
	app, port: config.server.port, logger,
});
