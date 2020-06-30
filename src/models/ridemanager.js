'use strict';

const { DBUtil } = require('../utils');

class RideManager {
    constructor(db) {
        this.db = db;
        this.dbUtil = new DBUtil(db);
    }

    async save(obj) {
        const query = `INSERT INTO 
        Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            obj.startLat,
            obj.startLong,
            obj.endLat,
            obj.endLong,
            obj.riderName,
            obj.driverName,
            obj.driverVehicle
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

module.exports = RideManager;