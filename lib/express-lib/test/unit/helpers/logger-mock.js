import {vi} from 'vitest';

export class LoggerMock {
	constructor() {
		this.debug = vi.fn();
		this.info = vi.fn();
		this.warn = vi.fn();
		this.error = vi.fn();
	}
}
