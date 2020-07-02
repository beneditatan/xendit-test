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

        const res = await this.dbUtil.asyncDbRun(query, values);

        const selectQuery = `SELECT * FROM Rides WHERE rideID = ${res.lastID}`;
        const rows = await this.dbUtil.asyncDbAll(selectQuery);
        if (rows.length > 0) {
            return Ride.fromJSON(rows[0]);
        } else {
            throw new Error('Inserted object not found');
        }
    }

    async getById(id) {
        const query = `SELECT * FROM Rides WHERE rideID = ${id}`;
        
        const rows = await this.dbUtil.asyncDbAll(query);

        if (rows.length === 0) {
            throw new ObjectNotFound('Ride with given ID is not found');
        } else {
            return Ride.fromJSON(rows[0]);
        }
    }

    async getAll(pagination) {
        const { limit, offset } = pagination;

        const query = `SELECT * FROM Rides ORDER BY rideID ASC 
                        LIMIT ${limit} OFFSET ${offset}`;

        const rows = await this.dbUtil.asyncDbAll(query);

        let resArray = [];
        for (var i = 0; i < rows.length; i++) {
            const obj = Ride.fromJSON(rows[i]);
            resArray.push(obj);
        }

        const count = await this.getCount();

        return { resArray, count };
    }

    async getCount() {
        const query = 'SELECT COUNT(*) AS rows FROM Rides';

        const rows = await this.dbUtil.asyncDbAll(query);

        return rows[0].rows;
    }
}

module.exports = RideManager;