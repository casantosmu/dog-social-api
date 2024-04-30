import {
	describe, it, expect, vi,
} from 'vitest';
import {errorHandlers} from '../../error-handlers.js'; // Adjust the import path
import {HttpError} from '../../http-error.js'; // Adjust the import path
import {RequestMock} from './helpers/request-mock.js';
import {ResponseMock} from './helpers/response-mock.js';
import {LoggerMock} from './helpers/logger-mock.js';

describe('errorHandlers', () => {
	it('handles not found routes', () => {
		const app = {use: vi.fn()};
		const logger = new LoggerMock();
		errorHandlers({app, logger});
		const notFoundHandler = app.use.mock.calls[0][0];
		const request = new RequestMock();
		const response = new ResponseMock();

		notFoundHandler(request, response);

		expect(response.status).toHaveBeenCalledWith(404);
		expect(response.json).toHaveBeenCalledWith({
			error: {
				code: 'ROUTE_NOT_FOUND',
				message: 'Route not found',
			},
		});
	});

	it('handles HttpError with specific error properties', () => {
		const app = {use: vi.fn()};
		const logger = new LoggerMock();
		errorHandlers({app, logger});
		const errorHandler = app.use.mock.calls[1][0];
		const error = new HttpError(
			'AUTH_FAIL',
			'Authentication failed',
			401,
		);
		const request = new RequestMock();
		const response = new ResponseMock();
		const next = vi.fn();

		errorHandler(error, request, response, next);

		expect(logger.warn).toHaveBeenCalledWith('Express error handler', error);
		expect(response.status).toHaveBeenCalledWith(error.statusCode);
		expect(response.json).toHaveBeenCalledWith({
			error: {
				code: error.code,
				message: error.message,
			},
		});
	});

	it('handles generic errors as internal server errors', () => {
		const app = {use: vi.fn()};
		const logger = new LoggerMock();
		errorHandlers({app, logger});
		const errorHandler = app.use.mock.calls[1][0];
		const error = new Error('Something went wrong');
		const request = new RequestMock();
		const response = new ResponseMock();
		const next = vi.fn();

		errorHandler(error, request, response, next);

		expect(logger.error).toHaveBeenCalledWith('Express error handler', error);
		expect(response.status).toHaveBeenCalledWith(500);
		expect(response.json).toHaveBeenCalledWith({
			error: {
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Internal server error',
			},
		});
	});
});
