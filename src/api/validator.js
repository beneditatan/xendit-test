const { ValidationError } = require('../core');

class APIValidator {
    static validatePostRideRequest(obj) {
        const {
            startLat,
            startLong,
            endLat,
            endLong,
            riderName,
            driverName,
            driverVehicle
        } = obj;

        if (startLat < -90 || startLat > 90 || startLong < -180 || startLong > 180) {
            throw new ValidationError('Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
        }

        if (endLat < -90 || endLat > 90 || endLong < -180 || endLong > 180) {
            throw new ValidationError('End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            throw new ValidationError('Rider name must be a non empty string');
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            throw new ValidationError('Driver name must be a non empty string');
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            throw new ValidationError('Driver vehicle name must be a non empty string');
        }
    }
}

module.exports = APIValidator;