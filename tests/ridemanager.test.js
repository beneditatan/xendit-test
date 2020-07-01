'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('../src/schemas');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const { Ride, RideManager } = require('../src/models');
const { DBUtil, ObjectNotFound } = require('../src/core');

describe('RideManager test', () => {
	let rm;
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);
			rm = new RideManager(db);
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

			// act
			const resObj = await rm.save(rideObj);

			// assert
			assert.equal(resObj.getStartLat(), START_LAT);
			assert.equal(resObj.getStartLong(), START_LONG);
			assert.equal(resObj.getEndLat(), END_LAT);
			assert.equal(resObj.getEndLong(), END_LONG);
			assert.equal(resObj.getRiderName(), RIDER_NAME);
			assert.equal(resObj.getDriverName(), DRIVER_NAME);
			assert.equal(resObj.getDriverVehicle(), DRIVER_VEHICLE);
		});
	});

	describe('#getByID', () => {
		it('should return Ride object given existing rideID', async () => {
			// arrange
			const expectedObj = getRideObject();
			const savedObj = await rm.save(expectedObj);
			const expectedID = savedObj.getRideID();

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
			const expectedID = 1;

			// assert
			await expect(rm.getById(expectedID)).to.be.rejectedWith(ObjectNotFound);
		});
	});
	
	describe("#getAll()", () => {
		it('should return the nth number of rows specified in limit and offset', async () => {
			// arrange
			const noOfObj = 11;
			let expectedIDs = [];
			const pagination = {
				limit: 5,
				offset: 3
			}
			

			for (var i = 0; i < noOfObj; i++) {
				const res = await rm.save(getRideObject());
				expectedIDs.push(res.getRideID());
			}

			// act
			const resArray = await rm.getAll(pagination);

			// assert
			assert.equal(resArray.length, pagination.limit);
			for (var i = 0; i < pagination.limit; i++) {
				assert.equal(resArray[i].getRideID(), expectedIDs[i + pagination.offset]);
			}
		})
	})
});