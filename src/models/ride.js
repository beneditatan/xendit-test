'use strict';

const { json } = require("body-parser");

class Ride {
    constructor() {
        this.rideID = null;
        this.startLat = null;
        this.startLong = null;
        this.endLat = null;
        this.endLong = null;
        this.riderName = null;
        this.driverName = null;
        this.driverVehicle = null;
        this.created = null;
    }

    static fromJSON(obj) {
        const rideObj = new Ride();
        if (obj.hasOwnProperty('rideID')) {
            rideObj.setRideID(obj.rideID);
        }
        if (obj.hasOwnProperty('created')) {
            rideObj.setCreated(obj.created);
        }
        rideObj.setStartLat(obj.startLat);
        rideObj.setStartLong(obj.startLong);
        rideObj.setEndLat(obj.endLat);
        rideObj.setEndLong(obj.endLong);
        rideObj.setRiderName(obj.riderName);
        rideObj.setDriverName(obj.driverName);
        rideObj.setDriverVehicle(obj.driverVehicle);

        return rideObj;
    }

    toJSON() {
        const obj = this;
        let jsonObj = {};
        if (obj.getRideID() !== null) {
            jsonObj.rideID = obj.getRideID();  
        }
        if (obj.getCreated() != null) {
            jsonObj.created = obj.getCreated();
        }

        jsonObj.startLat = obj.getStartLat();
        jsonObj.startLong = obj.getStartLong();
        jsonObj.endLat = obj.getEndLat();
        jsonObj.endLong = obj.getEndLong();
        jsonObj.riderName = obj.getRiderName();
        jsonObj.driverName = obj.getDriverName();
        jsonObj.driverVehicle = obj.getDriverVehicle();

        return jsonObj;
    }
    
    getRideID() {
        return this.rideID;
    }

    setRideID(val) {
        this.rideID = val;
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

    getCreated() {
        return this.created;
    }

    setCreated(val) {
        this.created = val;
    }
}

module.exports = Ride;