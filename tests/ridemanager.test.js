'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('../src/schemas');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const { Ride, RideManager } = require('../src/models');
const { DBUtil } = require('../src/core');

describe('RideManager test', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
	});

	afterEach((done) => {
		db.serialize((err) => {
			if (err) {
				return done(err);
			}

			const dbUtil = new DBUtil(db);
			const query = 'DELETE FROM Rides';
			dbUtil.asyncDbRun(query, []);

			done();
		})
	})

	const START_LAT = -6.347617;
	const START_LONG = 106.826691;
	const END_LAT = -6.193758;
	const END_LONG = 106.801613;
	const RIDER_NAME = 'Benedita';
	const DRIVER_NAME = 'Samuel';
	const DRIVER_VEHICLE = 'Toyota Avanza';

	const getRideObject = () => {
		const rideObj = new Ride();
		rideObj.setStartLat(START_LAT);
		rideObj.setStartLong(START_LONG);
		rideObj.setEndLat(END_LAT);
		rideObj.setEndLong(END_LONG);
		rideObj.setRiderName(RIDER_NAME);
		rideObj.setDriverName(DRIVER_NAME);
		rideObj.setDriverVehicle(DRIVER_VEHICLE);
		
		return rideObj
	}
	
	describe('#save()', () => {
		it('should return object row when object is successfully written to db', async () => {
			// arrange
			const rideObj = getRideObject();
			const rm = new RideManager(db);

			// act
			const rows = await rm.save(rideObj);

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

	describe('#getByID', () => {
		it('should return Ride object given existing rideID', async () => {
			// arrange
			const rm = new RideManager(db);
			const expectedObj = getRideObject();
			const rows = await rm.save(expectedObj);
			const expectedID = rows[0].rideID;

			// act
			const resObj = await rm.getById(expectedID);

			// assert
			assert.equal(resObj.getStartLat(), START_LAT);
			assert.equal(resObj.getStartLong(), START_LONG);
			assert.equal(resObj.getEndLat(), END_LAT);
			assert.equal(resObj.getEndLong(), END_LONG);
			assert.equal(resObj.getRiderName(), RIDER_NAME);
			assert.equal(resObj.getDriverName(), DRIVER_NAME);
			assert.equal(resObj.getDriverVehicle(), DRIVER_VEHICLE);
		});

		it('should throw exception when ride is not found', async () => {
			// arrange
			const rm = new RideManager(db);
			const expectedID = 1;
			const error = new ObjectNotFound();

			// assert
			await expect(rm.getById(expectedID)).to.be.rejectedWith(error);
			
		})
	})
});