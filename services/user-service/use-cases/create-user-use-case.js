import {User} from '../domain/user.js';
import {UserEmail} from '../domain/user-email.js';
import {UserLanguage} from '../domain/user-language.js';
import {UserLocation} from '../domain/user-location.js';
import {UserName} from '../domain/user-name.js';
import {UserPassword} from '../domain/user-password.js';
import {ConflictError, ErrorCodes} from '../domain/error.js';

export const createUserUseCase = ({userRepositoryFactory}) => async userDto => {
	const username = new UserName(userDto.username);
	const email = new UserEmail(userDto.email);
	const password = new UserPassword(userDto.password);
	const location = new UserLocation(userDto.latitude, userDto.longitude);
	const language = new UserLanguage(userDto.language);

	const userRepository = userRepositoryFactory.fromLocation(location);

	const userEmailExists = await userRepository.existsByEmail(email.value);
	if (userEmailExists) {
		throw new ConflictError(ErrorCodes.USER_EMAIL_EXISTS, 'User email already exists');
	}

	const userNameExists = await userRepository.existsByUserName(username.value);
	if (userNameExists) {
		throw new ConflictError(ErrorCodes.USERNAME_EXISTS, 'Username already exists');
	}

	const user = new User({
		username, email, password, location, language,
	});

	await userRepository.save(user);

	return user;
};
