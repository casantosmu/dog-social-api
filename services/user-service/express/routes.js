import {HttpError, httpStatusCode} from '@dog-social-api/express-lib';
import {Router as createRouter} from 'express';
import {BadRequestError, ConflictError, NotFoundError} from '../domain/error.js';

export const routes = (app, {createUserUseCase, updateUserUseCase, deleteUserUseCase, getUserByIdUseCase}) => {
	const router = createRouter();

	router.post('/', async (request, response, next) => {
		try {
			const user = await createUserUseCase(request.body);
			response
				.status(httpStatusCode.created)
				.json({
					id: user.id.value,
				});
		} catch (error) {
			if (error instanceof BadRequestError) {
				next(new HttpError(httpStatusCode.badRequest, error.code, error.message));
			} else if (error instanceof ConflictError) {
				next(new HttpError(httpStatusCode.conflict, error.code, error.message));
			} else {
				next(error);
			}
		}
	});

	router.get('/:id', async (request, response, next) => {
		try {
			const user = await getUserByIdUseCase(request.params.id);
			response
				.status(httpStatusCode.ok)
				.json({
					id: user.id.value,
					username: user.username.value,
					email: user.email.value,
					latitude: user.location.value.latitude,
					longitude: user.location.value.longitude,
					language: user.language.value,
				});
		} catch (error) {
			if (error instanceof BadRequestError) {
				next(new HttpError(httpStatusCode.badRequest, error.code, error.message));
			} else if (error instanceof NotFoundError) {
				next(new HttpError(httpStatusCode.notFound, error.code, error.message));
			} else {
				next(error);
			}
		}
	});

	router.put('/:id', async (request, response, next) => {
		try {
			const user = await updateUserUseCase(request.params.id, request.body);
			response
				.status(httpStatusCode.ok)
				.json({
					id: user.id.value,
				});
		} catch (error) {
			if (error instanceof BadRequestError) {
				next(new HttpError(httpStatusCode.badRequest, error.code, error.message));
			} else if (error instanceof NotFoundError) {
				next(new HttpError(httpStatusCode.notFound, error.code, error.message));
			} else if (error instanceof ConflictError) {
				next(new HttpError(httpStatusCode.conflict, error.code, error.message));
			} else {
				next(error);
			}
		}
	});

	router.delete('/:id', async (request, response, next) => {
		try {
			const user = await deleteUserUseCase(request.params.id);
			response
				.status(httpStatusCode.ok)
				.json({
					id: user.id.value,
				});
		} catch (error) {
			if (error instanceof BadRequestError) {
				next(new HttpError(httpStatusCode.badRequest, error.code, error.message));
			} else if (error instanceof NotFoundError) {
				next(new HttpError(httpStatusCode.notFound, error.code, error.message));
			} else {
				next(error);
			}
		}
	});

	app.use('/v1/users', router);
};
