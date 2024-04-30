import {Router as createRouter} from 'express';

export const routes = ({app, logger}) => {
	const router = createRouter();

	router.get('/', (request, response) => {
		logger.info('Some info data');
		response.send('Hello World!');
	});

	app.use('/v1/users', router);
};
