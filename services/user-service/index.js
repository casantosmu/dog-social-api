import {AsyncLocalStorage} from 'node:async_hooks';
import closeWithGrace from 'close-with-grace';
import {createServer} from '@dog-social-api/express-lib';
import {PinoLogger} from '@dog-social-api/logger-lib';
import {config} from './config.js';
import {createApp} from './express/app.js';
import {PostgresPool} from './repositories/postgres-pool.js';

const context = new AsyncLocalStorage();

const logger = new PinoLogger({
	name: 'user-service',
	level: config.logger.level,
	pretty: config.isDevelopment,
	context,
});

const postgresPool = new PostgresPool({
	host: config.postgres.host,
	port: config.postgres.port,
	user: config.postgres.user,
	password: config.postgres.password,
	database: config.postgres.database,
	logger,
});

const app = createApp({logger, context});
const server = createServer({app, logger});

await postgresPool.start();
await server.start(config.server.port);

closeWithGrace({logger}, async ({signal, err}) => {
	if (err) {
		logger.error('Closing with error', err);
	} else {
		logger.info(`${signal} received`);
	}

	await server.stop();
	await postgresPool.stop();
});
