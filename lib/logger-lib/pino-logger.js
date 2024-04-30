import pino from 'pino';

export class PinoLogger {
	#logger;

	constructor({name, level = 'info', pretty = false, context}) {
		this.#logger = pino({
			name,
			level,
			mixin() {
				return {...context.getStore()};
			},
			formatters: {
				level(label, number) {
					return {level: number};
				},
			},
			messageKey: 'message',
			errorKey: 'error',
			...(pretty && {
				transport: {
					target: 'pino-pretty',
				},
			}),
		});
	}

	debug(message, metadata) {
		this.#log('debug', message, metadata);
	}

	info(message, metadata) {
		this.#log('info', message, metadata);
	}

	warn(message, metadata) {
		this.#log('warn', message, metadata);
	}

	error(message, metadata) {
		this.#log('error', message, metadata);
	}

	#log(level, message, metadata) {
		if (metadata instanceof Error) {
			this.#logger[level]({error: metadata}, message);
		} else if (metadata) {
			this.#logger[level]({metadata}, message);
		} else {
			this.#logger[level](message);
		}
	}
}
