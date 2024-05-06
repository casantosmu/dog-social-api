import {HttpError} from './http-error.js';
import {httpStatusCode} from './http-status-code.js';

export const errorHandlers = (app, {logger}) => {
	app.use((request, response) => {
		response.status(httpStatusCode.notFound).json({
			error: {
				code: 'ROUTE_NOT_FOUND',
				message: 'Route not found',
			},
		});
	});

	app.use((error, request, response, _next) => {
		const isHttpError = error instanceof HttpError;

		const {statusCode, code, message} = isHttpError
			? error
			: {
				statusCode: httpStatusCode.internalServerError,
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Internal server error',
			};

		const logLevel = statusCode >= 500 ? 'error' : 'warn';
		logger[logLevel]('Express error handler', error);

		response.status(statusCode).json({
			error: {
				code,
				message,
			},
		});
	});
};
