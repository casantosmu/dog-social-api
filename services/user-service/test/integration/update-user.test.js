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
import {UserLanguage} from '../../domain/user-language.js';
import {UserLocation} from '../../domain/user-location.js';
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

describe('PUT /v1/users/:id', () => {
	it('should update user in local database if user is from the northern hemisphere', async () => {
		const user = new User({
			username: new UserName(faker.word.sample({length: {min: 2, max: 15}})),
			email: new UserEmail(faker.internet.email()),
			password: new UserPassword('oldA123!'),
			location: new UserLocation(40.7128, -74.006),
			language: new UserLanguage('en'),
		});

		const updateData = {
			username: faker.word.sample({length: {min: 2, max: 15}}),
			email: faker.internet.email(),
			password: 'newA123!',
			latitude: 52.52,
			longitude: 13.405,
			language: 'de',
		};

		await northUserRepository.save(user);

		const response = await supertest(app)
			.put(`/v1/users/${user.id.value}`)
			.send(updateData)
			.expect(200);

		const updatedUser = await northUserRepository.findById(user.id.value);

		expect(response.body).toStrictEqual({
			id: user.id.value,
		});

		expect(updatedUser.username.value).toBe(updateData.username);
		expect(updatedUser.email.value).toBe(updateData.email);
		expect(await updatedUser.password.compare(updateData.password)).toBeTruthy();
		expect(updatedUser.location.value.latitude).toBe(updateData.latitude);
		expect(updatedUser.location.value.longitude).toBe(updateData.longitude);
		expect(updatedUser.language.value).toBe(updateData.language);
	});

	it('should send updated user data to external API if user is from the southern hemisphere', async () => {
		const user = {
			id: faker.string.uuid(),
			username: faker.word.sample({length: {min: 2, max: 15}}),
			email: faker.internet.email(),
			password: 'oldA123!',
			latitude: 40.7128,
			longitude: -74.006,
			language: 'en',
		};

		const updateData = {
			username: faker.word.sample({length: {min: 2, max: 15}}),
			email: faker.internet.email(),
			password: 'newA123!',
			latitude: -33.8688,
			longitude: 151.2093,
			language: 'en',
		};

		nock(config.southUserApi.baseUrl)
			.persist()
			.get(`/v1/users/${user.id}`)
			.reply(200, user);

		nock(config.southUserApi.baseUrl)
			.get('/v1/users')
			.query({
				username: updateData.username,
			})
			.reply(200, {users: []});

		nock(config.southUserApi.baseUrl)
			.get('/v1/users')
			.query({
				email: updateData.email,
			})
			.reply(200, {users: []});

		const scope = nock(config.southUserApi.baseUrl)
			.put(`/v1/users/${user.id}`, updateData)
			.reply(204);

		const response = await supertest(app)
			.put(`/v1/users/${user.id}`)
			.send(updateData)
			.expect(200);

		expect(response.body).toStrictEqual({
			id: user.id,
		});
		expect(scope.isDone()).toBeTruthy();
	});
});
