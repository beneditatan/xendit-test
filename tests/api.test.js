'use strict';

const request = require('supertest');
const sinon = require('sinon');
const { assert, expect } = require("@sinonjs/referee");

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const { DBUtil, ObjectNotFound } = require('../src/core');
const { Ride, RideManager } = require('../src/models');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
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

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('GET /rides/:id', () => {
        it('should return 200 when ID exists', async () => {
            // arrange
            const testID = 1;
            const stubRideManager = sinon.createStubInstance(RideManager, {
                getById: () => {}
            });
            const expectedObj = getRideObject();
            expectedObj.setRideID(testID);
            expectedObj.setCreated('2020-06-30 13:13:08');
            stubRideManager.getById.withArgs(testID).returns(expectedObj);
            
            // act
            const res = await request(app)
                .get(`/rides/${testID}`)

            expect(res.statusCode).toEqual(200);
        });

        it('should return 404 when ID does not exist', async () => {
            // arrange
            const testID = 1;
            const stubRideManager = sinon.createStubInstance(RideManager, {
                getById: () => {}
            });

            stubRideManager.getById.withArgs(testID).throws(ObjectNotFound);

            const res = await request(app)
                .get(`/rides/${testID}`)

            expect(res.statusCode).toEqual(404);
            expect(res.body.error_code).toEqual(ErrorCode.RIDES_NOT_FOUND_ERROR);
        })
    })
});