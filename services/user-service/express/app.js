import express from 'express';
import helmet from 'helmet';
import {errorHandlers, httpLogger, requestId} from '@dog-social-api/express-lib';
import {routes} from './routes.js';

export const createApp = ({logger, context}) => {
	const app = express();

	app.disable('x-powered-by');

	app.use(requestId({context}));
	app.use(httpLogger({logger}));
	app.use(helmet());
	app.use(express.urlencoded({extended: true}));
	app.use(express.json());

	routes({app, logger});

	errorHandlers({app, logger});

	return app;
};
