import http from 'node:http';

export const createServer = ({app, port, logger}) => {
	const server = http.createServer(app);

	const start = async () =>
		new Promise((resolve, reject) => {
			server.listen(port, () => {
				const {port: serverPort} = server.address();
				logger.info(`Server successfully started at port ${serverPort}`);
				resolve();
			});
			server.on('error', error => {
				reject(new Error('Server start error', {cause: error}));
			});
		});

	const stop = async () =>
		new Promise((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(new Error('Server stop error', {cause: error}));
					return;
				}

				logger.info('Server successfully stopped');
				resolve();
			});
		});

	return {start, stop};
};
