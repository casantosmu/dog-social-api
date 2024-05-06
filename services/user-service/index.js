import closeWithGrace from 'close-with-grace';
import {logger, postgresPool, server} from './composition-root.js';

await postgresPool.start();
await server.start();

closeWithGrace({logger}, async ({signal, err}) => {
	if (err) {
		logger.error('Closing with error', err);
	} else {
		logger.info(`${signal} received`);
	}

	await server.stop();
	await postgresPool.stop();
});
