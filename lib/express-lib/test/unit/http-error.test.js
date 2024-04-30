import {describe, it, expect} from 'vitest';
import {HttpError} from '../../http-error.js';

describe('HttpError', () => {
	describe('When instantiated with statusCode, code, and message', () => {
		const statusCode = 404;
		const code = 'NOT_FOUND';
		const message = 'Resource not found';

		const error = new HttpError(statusCode, code, message);

		it('Then it should have the correct statusCode', () => {
			expect(error.statusCode).toBe(statusCode);
		});

		it('Then it should have the correct code', () => {
			expect(error.code).toBe(code);
		});

		it('Then it should have the correct message', () => {
			expect(error.message).toBe(message);
		});
	});

	describe('When instantiated with an additional cause', () => {
		it('Then it should have the correct cause', () => {
			const cause = new Error('Underlying error');

			const error = new HttpError(0, '', '', {cause});

			expect(error.cause).toBe(cause);
		});
	});
});
