import {HttpError, httpStatusCode} from '@dog-social-api/express-lib';
import {Router as createRouter} from 'express';
import {BadRequestError, ConflictError} from '../domain/error.js';

export const routes = (app, {createUserUseCase}) => {
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

	app.use('/v1/users', router);
};
