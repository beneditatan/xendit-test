'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('../src/schemas');
const assert = require('assert');

const Ride = require('../src/models/ride');

describe('Ride DB model', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
	});

	const START_LAT = -6.347617;
	const START_LONG = 106.826691;
	const END_LAT = -6.193758;
	const END_LONG = 106.801613;
	const RIDER_NAME = 'Benedita';
	const DRIVER_NAME = 'Samuel';
	const DRIVER_VEHICLE = 'Toyota Avanza';
	
	describe('#save()', () => {
		it('should return object row when object is successfully written to db', async () => {
			// arrange
			const rideObj = new Ride(db);
			rideObj.setStartLat(START_LAT);
			rideObj.setStartLong(START_LONG);
			rideObj.setEndLat(END_LAT);
			rideObj.setEndLong(END_LONG);
			rideObj.setRiderName(RIDER_NAME);
			rideObj.setDriverName(DRIVER_NAME);
			rideObj.setDriverVehicle(DRIVER_VEHICLE);

			// act
			const rows = await rideObj.save();

			// assert	
			assert.equal(rows.length, 1); 		// there should exactly be one row

			const resObj = rows[0];
			assert.equal(resObj.startLat, START_LAT);
			assert.equal(resObj.startLong, START_LONG);
			assert.equal(resObj.endLat, END_LAT);
			assert.equal(resObj.endLong, END_LONG);
			assert.equal(resObj.riderName, RIDER_NAME);
			assert.equal(resObj.driverName, DRIVER_NAME);
			assert.equal(resObj.driverVehicle, DRIVER_VEHICLE);
		});
	});
});