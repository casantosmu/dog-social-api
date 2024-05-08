import {UserId} from './user-id.js';

export class User {
	constructor({id, username, email, password, location, language}) {
		this.id = id ?? new UserId();
		this.username = username;
		this.email = email;
		this.password = password;
		this.location = location;
		this.language = language;
	}
}
