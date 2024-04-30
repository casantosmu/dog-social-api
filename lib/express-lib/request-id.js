import crypto from 'node:crypto';

const REQUEST_ID_HEADER = 'x-request-id';

export const requestId = ({context}) => (request, response, next) => {
	const requestId = request.headers[REQUEST_ID_HEADER] ?? crypto.randomUUID();

	response.setHeader(REQUEST_ID_HEADER, requestId);

	const currentContext = context.getStore();

	if (currentContext) {
		currentContext.requestId = requestId;
		next();
		return;
	}

	context.run({requestId}, next);
};
