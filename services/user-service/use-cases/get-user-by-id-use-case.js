import {BadRequestError, NotFoundError, ErrorCodes} from '../domain/error.js';

export const getUserByIdUseCase = ({userRepositoryFactory}) => async userId => {
	if (!userId) {
		throw new BadRequestError(ErrorCodes.TYPE_ERROR, 'User ID is required');
	}

	const userRepository = await userRepositoryFactory.fromUserId(userId);

	const user = await userRepository?.findById(userId);
	if (!user) {
		throw new NotFoundError(ErrorCodes.USER_NOT_FOUND, 'User not found');
	}

	return user;
};
