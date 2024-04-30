import EventEmitter from 'node:events';

// eslint-disable-next-line unicorn/prefer-event-target
export class RequestMock extends EventEmitter {
	constructor({method, originalUrl, headers, remoteAddress, remotePort} = {}) {
		super();
		this.method = method;
		this.originalUrl = originalUrl;
		this.headers = {...headers};
		this.socket = {};
		this.socket.remoteAddress = remoteAddress;
		this.socket.remotePort = remotePort;
	}
}
