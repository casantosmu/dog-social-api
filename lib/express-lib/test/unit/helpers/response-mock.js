import EventEmitter from 'node:events';
import {vi} from 'vitest';

// eslint-disable-next-line unicorn/prefer-event-target
export class ResponseMock extends EventEmitter {
	constructor({statusCode, headers} = {}) {
		super();
		this.statusCode = statusCode;
		this.headers = {...headers};
		this.status = vi.fn().mockReturnThis();
		this.json = vi.fn();
		this.setHeader = vi.fn();
	}

	getHeaders() {
		return {...this.headers};
	}
}
