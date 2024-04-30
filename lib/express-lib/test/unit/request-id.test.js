import crypto from 'node:crypto';
import {
	describe, it, expect, vi,
} from 'vitest';
import {requestId} from '../../request-id.js';
import {RequestMock} from './helpers/request-mock.js';
import {ResponseMock} from './helpers/response-mock.js';
import {ContextMock} from './helpers/context-mock.js';

describe('requestId', () => {
	it('should set a new requestId in the response headers if none is provided in the request', () => {
		const context = new ContextMock();
		const request = new RequestMock({headers: {}});
		const response = new ResponseMock();
		const next = vi.fn();
		vi.spyOn(crypto, 'randomUUID').mockReturnValue('new-random-uuid');

		requestId({context})(request, response, next);

		expect(response.setHeader).toHaveBeenCalledWith('x-request-id', 'new-random-uuid');
		expect(next).toHaveBeenCalled();
	});

	it('should use existing requestId from the request headers', () => {
		const context = new ContextMock();
		const request = new RequestMock({
			headers: {'x-request-id': 'existing-uuid'},
		});
		const response = new ResponseMock();
		const next = vi.fn();

		requestId({context})(request, response, next);

		expect(response.setHeader).toHaveBeenCalledWith('x-request-id', 'existing-uuid');
		expect(next).toHaveBeenCalled();
	});

	it('should attach requestId to the context if the store it\'s defined', () => {
		const store = {};
		const context = new ContextMock({store});
		const request = new RequestMock({
			headers: {'x-request-id': 'uuid'},
		});
		const response = new ResponseMock();
		const next = vi.fn();

		requestId({context})(request, response, next);

		expect(store.requestId).toBe('uuid');
		expect(context.run).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it('should create and use a new context if the store it\'s not defined', () => {
		const context = new ContextMock({store: null});
		const request = new RequestMock({
			headers: {'x-request-id': 'uuid'},
		});
		const response = new ResponseMock();
		const next = vi.fn();

		requestId({context})(request, response, next);

		expect(context.run).toHaveBeenCalledWith(
			{requestId: 'uuid'},
			next,
		);
		expect(next).toHaveBeenCalled();
	});
});
