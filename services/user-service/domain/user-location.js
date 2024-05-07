import {BadRequestError, ErrorCodes} from './error.js';

export class UserLocation {
	#value;

	get value() {
		return this.#value;
	}

	static #latitudeMin = -90;
	static #latitudeMax = 90;
	static #longitudeMin = -180;
	static #longitudeMax = 180;

	constructor(latitude, longitude) {
		if (typeof latitude !== 'number' || typeof longitude !== 'number') {
			throw new BadRequestError(ErrorCodes.TYPE_ERROR, 'Latitude and longitude must be numbers.');
		}

		if (latitude < UserLocation.#latitudeMin || latitude > UserLocation.#latitudeMax) {
			throw new BadRequestError(ErrorCodes.INVALID_LATITUDE_RANGE, `Latitude must be between ${UserLocation.#latitudeMin} and ${UserLocation.#latitudeMax} degrees.`);
		}

		if (longitude < UserLocation.#longitudeMin || longitude > UserLocation.#longitudeMax) {
			throw new BadRequestError(ErrorCodes.INVALID_LONGITUDE_RANGE, `Longitude must be between ${UserLocation.#longitudeMin} and ${UserLocation.#longitudeMax} degrees.`);
		}

		this.#value = {};
		this.#value.latitude = latitude;
		this.#value.longitude = longitude;
		Object.freeze(this.#value);
	}

	isNorthernHemisphere() {
		return this.#value.latitude > 0;
	}

	isSouthernHemisphere() {
		return this.#value.latitude < 0;
	}
}
