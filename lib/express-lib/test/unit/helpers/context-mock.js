import {vi} from 'vitest';

export class ContextMock {
	constructor({store} = {}) {
		this.store = store;
		this.getStore = vi.fn(() => store);
		this.run = vi.fn((store, callback) => callback());
	}
}
