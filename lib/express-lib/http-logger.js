export const httpLogger = ({logger}) => (request, response, next) => {
	response.on('close', () => {
		let logLevel = 'info';
		if (response.statusCode >= 500) {
			logLevel = 'error';
		} else if (response.statusCode >= 400) {
			logLevel = 'warn';
		}

		logger[logLevel]('Request completed', {
			request: {
				method: request.method,
				url: request.originalUrl,
				headers: request.headers,
				remoteAddress: request.socket.remoteAddress,
				remotePort: request.socket.remotePort,
			},
			response: {
				statusCode: response.statusCode,
				headers: response.getHeaders(),
			},
		});
	});

	next();
};
