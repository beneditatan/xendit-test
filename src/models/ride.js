'use strict';

class Ride {
    constructor() {
        this.startLat = null;
        this.startLong = null;
        this.endLat = null;
        this.endLong = null;
        this.riderName = null;
        this.driverName = null;
        this.driverVehicle = null;
    }

    static fromJSON(obj) {
        const rideObj = new Ride();
        rideObj.setStartLat(obj.startLat);
        rideObj.setStartLong(obj.startLong);
        rideObj.setEndLat(obj.endLat);
        rideObj.setEndLong(obj.endLong);
        rideObj.setRiderName(obj.riderName);
        rideObj.setDriverName(obj.driverName);
        rideObj.setDriverVehicle(obj.driverVehicle);

        return rideObj;
    }

    getStartLat() {
        return this.startLat;
    }

    setStartLat(val) {
        this.startLat = val;
    }

    getStartLong() {
        return this.startLong;
    }

    setStartLong(val) {
        this.startLong = val;
    }

    getEndLat() {
        return this.endLat;
    }

    setEndLat(val) {
        this.endLat = val;
    }

    getEndLong() {
        return this.endLong;
    }

    setEndLong(val) {
        this.endLong = val;
    }

    getRiderName() {
        return this.riderName;
    }

    setRiderName(val) {
        this.riderName = val;
    }

    getDriverName() {
        return this.driverName;
    }

    setDriverName(val) {
        this.driverName = val;
    }

    getDriverVehicle() {
        return this.driverVehicle;
    }

    setDriverVehicle(val) {
        this.driverVehicle = val;
    }
}

module.exports = Ride;