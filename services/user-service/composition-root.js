import {AsyncLocalStorage} from 'node:async_hooks';
import {createServer} from '@dog-social-api/express-lib';
import {PinoLogger} from '@dog-social-api/logger-lib';
import {config} from './config.js';
import {createApp} from './express/app.js';
import {PostgresPool} from './repositories/postgres-pool.js';
import {createUserUseCase} from './use-cases/create-user-use-case.js';
import {updateUserUseCase} from './use-cases/update-user-use-case.js';
import {NorthUserRepository} from './repositories/north-user-repository.js';
import {UserRepositoryFactory} from './repositories/user-repository-factory.js';
import {SouthUserRepository} from './repositories/south-user-repository.js';

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

export const northUserRepository = new NorthUserRepository({
	pool: postgresPool,
});

const southUserRepository = new SouthUserRepository({
	baseUrl: config.southUserApi.baseUrl,
	apiKey: config.southUserApi.apiKey,
	timeout: config.southUserApi.timeout,
});

const userRepositoryFactory = new UserRepositoryFactory({
	northUserRepository,
	southUserRepository,
});

export const app = createApp(
	{
		logger, context,
	},
	{
		createUserUseCase: createUserUseCase({
			userRepositoryFactory,
		}),
		updateUserUseCase: updateUserUseCase({
			userRepositoryFactory,
		}),
	},
);

export const server = createServer({
	app, port: config.server.port, logger,
});
