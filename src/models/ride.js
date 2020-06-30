'use strict';

const { DBUtil } = require('../utils');

class Ride {
    constructor(db) {
        this.db = db;
        this.dbUtil = new DBUtil(this.db);
        this.startLat = null;
        this.startLonng = null;
        this.endLat = null;
        this.endLong = null;
        this.riderName = null;
        this.driverName = null;
        this.driverVehicle = null;
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

    async save() {
        const query = `INSERT INTO 
        Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            this.startLat,
            this.startLong,
            this.endLat,
            this.endLong,
            this.riderName,
            this.driverName,
            this.driverVehicle
        ];
        let res;
        try {
            res = await this.dbUtil.asyncDbRun(query, values);
        } catch (error) {
            throw error;
        }

        const selectQuery = `SELECT * FROM Rides WHERE rideID = ${res.lastID}`;
        try {
            const rows = await this.dbUtil.asyncDbAll(selectQuery);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Ride;