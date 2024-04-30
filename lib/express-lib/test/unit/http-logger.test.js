import {
	describe, it, expect, vi,
} from 'vitest';
import {httpLogger} from '../../http-logger.js';
import {RequestMock} from './helpers/request-mock.js';
import {ResponseMock} from './helpers/response-mock.js';
import {LoggerMock} from './helpers/logger-mock.js';

describe('httpLogger', () => {
	it('logs detailed request and response information and calls next', () => {
		const logger = new LoggerMock();
		const request = new RequestMock({
			method: 'GET',
			originalUrl: '/test',
			headers: {'content-type': 'application/json'},
			remoteAddress: '127.0.0.1',
			remotePort: 8080,
		});
		const response = new ResponseMock({
			statusCode: 200,
			headers: {'content-length': '20'},
		});
		const next = vi.fn();

		httpLogger({logger})(request, response, next);
		response.emit('close');

		expect(logger.info).toHaveBeenCalledWith('Request completed', {
			request: {
				method: 'GET',
				url: '/test',
				headers: {'content-type': 'application/json'},
				remoteAddress: '127.0.0.1',
				remotePort: 8080,
			},
			response: {
				statusCode: 200,
				headers: {'content-length': '20'},
			},
		});
		expect(next).toHaveBeenCalled();
	});

	it('logs at "info" level for status code 200', () => {
		const logger = new LoggerMock();
		const request = new RequestMock();
		const response = new ResponseMock({statusCode: 200});
		const next = vi.fn();

		httpLogger({logger})(request, response, next);
		response.emit('close');

		expect(logger.info).toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it('logs at "warn" level for status code 400', () => {
		const logger = new LoggerMock();
		const request = new RequestMock();
		const response = new ResponseMock({statusCode: 400});
		const next = vi.fn();

		httpLogger({logger})(request, response, next);
		response.emit('close');

		expect(logger.warn).toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it('logs at "error" level for status code 500', () => {
		const logger = new LoggerMock();
		const request = new RequestMock();
		const response = new ResponseMock({statusCode: 500});
		const next = vi.fn();

		httpLogger({logger})(request, response, next);
		response.emit('close');

		expect(logger.error).toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});
});
