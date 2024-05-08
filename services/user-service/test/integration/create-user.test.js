import {
	describe, it, afterEach, expect, beforeAll, afterAll,
} from 'vitest';
import supertest from 'supertest';
import nock from 'nock';
import {faker} from '@faker-js/faker';
import {
	postgresPool,
	app,
	northUserRepository,
} from '../../composition-root.js';
import {config} from '../../config.js';

beforeAll(async () => {
	await postgresPool.start();
});

afterAll(async () => {
	await postgresPool.stop();
});

afterEach(() => {
	nock.cleanAll();
});

describe('POST /v1/users', () => {
	it('should store user in local database if user is from the northern hemisphere', async () => {
		const northernUser = {
			username: faker.word.sample({length: {min: 2, max: 15}}),
			email: faker.internet.email(),
			password: 'abcA123.',
			latitude: 40.7128,
			longitude: -74.006,
			language: 'es',
		};

		const response = await supertest(app)
			.post('/v1/users')
			.send(northernUser)
			.expect(201);

		const userExists = await northUserRepository.existsByEmail(northernUser.email);

		expect(response.body).toStrictEqual({
			id: expect.any(String),
		});
		expect(userExists).toBeTruthy();
	});

	it('should send user data to external API if user is from the southern hemisphere', async () => {
		const southernUser = {
			username: faker.word.sample({length: {min: 2, max: 15}}),
			email: faker.internet.email(),
			password: 'abcA123.',
			latitude: -34.6037,
			longitude: -58.3816,
			language: 'es',
		};

		nock(config.southUserApi.baseUrl)
			.get('/v1/users')
			.query({
				username: southernUser.username,
			})
			.reply(200, {users: []});

		nock(config.southUserApi.baseUrl)
			.get('/v1/users')
			.query({
				email: southernUser.email,
			})
			.reply(200, {users: []});

		nock(config.southUserApi.baseUrl)
			.get(/\/v1\/users\/.*/)
			.reply(404, {
				code: 'USER_NOT_FOUND',
			});

		const scope = nock(config.southUserApi.baseUrl)
			.post('/v1/users', {
				id: /.+/i,
				...southernUser,
			})
			.reply(201);

		const response = await supertest(app)
			.post('/v1/users')
			.send(southernUser)
			.expect(201);

		expect(response.body).toStrictEqual({
			id: expect.any(String),
		});
		expect(scope.isDone()).toBeTruthy();
	});
});
