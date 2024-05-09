import {UserEmail} from '../domain/user-email.js';
import {UserLanguage} from '../domain/user-language.js';
import {UserLocation} from '../domain/user-location.js';
import {UserName} from '../domain/user-name.js';
import {UserPassword} from '../domain/user-password.js';
import {
	BadRequestError, ConflictError, ErrorCodes, NotFoundError,
} from '../domain/error.js';

export const updateUserUseCase = ({userRepositoryFactory}) => async (userId, userUpdateDto) => {
	if (!userId) {
		throw new BadRequestError(ErrorCodes.TYPE_ERROR, 'User ID is required');
	}

	const userRepository = await userRepositoryFactory.fromUserId(userId);

	const user = await userRepository?.findById(userId);
	if (!user) {
		throw new NotFoundError(ErrorCodes.USER_NOT_FOUND, 'User not found');
	}

	if (userUpdateDto.username) {
		const username = new UserName(userUpdateDto.username);
		const userNameExists = await userRepository.existsByUserName(username.value);
		if (userNameExists) {
			throw new ConflictError(ErrorCodes.USERNAME_EXISTS, 'Username already exists');
		}

		user.username = username;
	}

	if (userUpdateDto.email) {
		const email = new UserEmail(userUpdateDto.email);
		const userEmailExists = await userRepository.existsByEmail(email.value);
		if (userEmailExists) {
			throw new ConflictError(ErrorCodes.USER_EMAIL_EXISTS, 'User email already exists');
		}

		user.email = email;
	}

	if (userUpdateDto.password) {
		user.password = new UserPassword(userUpdateDto.password);
	}

	if (userUpdateDto.latitude !== undefined || userUpdateDto.longitude !== undefined) {
		user.location = new UserLocation(userUpdateDto.latitude, userUpdateDto.longitude);
	}

	if (userUpdateDto.language) {
		user.language = new UserLanguage(userUpdateDto.language);
	}

	await userRepository.update(user);

	return user;
};
