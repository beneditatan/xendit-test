'use strict';

const { DBUtil, ObjectNotFound } = require('../core');
const Ride = require('./ride');

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
            // TODO: check if rows length is 1
            return rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        const query = `SELECT * FROM Rides WHERE rideID = ${id}`;
        let rows;
        try {
            rows = await this.dbUtil.asyncDbAll(query);
        } catch (error) {
            throw error;
        }

        if (rows.length === 0) {
            throw new ObjectNotFound("Ride with given ID is not found");
        } else {
            return Ride.fromJSON(rows[0]);
        }
    }
}

module.exports = RideManager;