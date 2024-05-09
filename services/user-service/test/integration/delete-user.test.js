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
import {User} from '../../domain/user.js';
import {UserName} from '../../domain/user-name.js';
import {UserEmail} from '../../domain/user-email.js';
import {UserPassword} from '../../domain/user-password.js';
import {UserLocation} from '../../domain/user-location.js';
import {UserLanguage} from '../../domain/user-language.js';
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

describe('DELETE /v1/users/:id', () => {
	it('should delete user in local database if user is from the northern hemisphere', async () => {
		const user = new User({
			username: new UserName(faker.word.sample({length: {min: 2, max: 15}})),
			email: new UserEmail(faker.internet.email()),
			password: new UserPassword('abcA123.'),
			location: new UserLocation(40.7128, -74.006),
			language: new UserLanguage('en'),
		});

		await northUserRepository.save(user);

		const response = await supertest(app)
			.delete(`/v1/users/${user.id.value}`)
			.expect(200);

		const userExists = await northUserRepository.findById(user.id.value);

		expect(response.body).toStrictEqual({
			id: user.id.value,
		});
		expect(userExists).toBeUndefined();
	});

	it('should notify external API when a user from the southern hemisphere is deleted', async () => {
		const user = {
			id: faker.string.uuid(),
			username: faker.word.sample({length: {min: 2, max: 15}}),
			email: faker.internet.email(),
			password: 'abcA123.',
			latitude: 40.7128,
			longitude: -74.006,
			language: 'en',
		};

		nock(config.southUserApi.baseUrl)
			.persist()
			.get(`/v1/users/${user.id}`)
			.reply(200, user);

		const scope = nock(config.southUserApi.baseUrl)
			.delete(`/v1/users/${user.id}`)
			.reply(200);

		const response = await supertest(app)
			.delete(`/v1/users/${user.id}`)
			.expect(200);

		expect(response.body).toStrictEqual({
			id: user.id,
		});
		expect(scope.isDone()).toBeTruthy();
	});
});
