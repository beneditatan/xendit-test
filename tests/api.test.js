'use strict';

const request = require('supertest');
const sinon = require('sinon');
const { assert, expect } = require("@sinonjs/referee");

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const { DBUtil, ObjectNotFound, ErrorCode } = require('../src/core');
const { Ride, RideManager } = require('../src/models');
const rm = new RideManager(db);
const app = require('../src/app')(db, rm);
const buildSchemas = require('../src/schemas');
const { stub } = require('sinon');

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
    
    const START_LAT = -6.347617;
	const START_LONG = 106.826691;
	const END_LAT = -6.193758;
	const END_LONG = 106.801613;
	const RIDER_NAME = 'Benedita';
	const DRIVER_NAME = 'Samuel';
    const DRIVER_VEHICLE = 'Toyota Avanza';
    const CREATED = '2020-06-30 13:13:08';

	const getRideObject = () => {
		const rideObj = new Ride();
		rideObj.setStartLat(START_LAT);
		rideObj.setStartLong(START_LONG);
		rideObj.setEndLat(END_LAT);
		rideObj.setEndLong(END_LONG);
		rideObj.setRiderName(RIDER_NAME);
		rideObj.setDriverName(DRIVER_NAME);
        rideObj.setDriverVehicle(DRIVER_VEHICLE);
        rideObj.setCreated(CREATED);
		
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

    describe('GET /rides/:rideID', () => {
        let sandbox;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
        })

        afterEach(() => {
            sandbox.restore();
        })

        it('should return 200 when ID exists', async () => {
            // arrange
            const testID = 1;

            const expectedObj = getRideObject();
            expectedObj.setRideID(testID);

            const stubGetById = sandbox.stub(RideManager.prototype, 'getById');
            stubGetById.withArgs(testID).resolves(expectedObj);

            // act
            const res = await request(app).get(`/rides/${testID}`)

            // assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.rideID).toEqual(testID);
            expect(res.body.startLat).toEqual(START_LAT);
            expect(res.body.endLat).toEqual(END_LAT);
            expect(res.body.endLong).toEqual(END_LONG);
            expect(res.body.riderName).toEqual(RIDER_NAME);
            expect(res.body.driverName).toEqual(DRIVER_NAME);
            expect(res.body.driverVehicle).toEqual(DRIVER_VEHICLE);
            expect(res.body.created).toEqual(CREATED);

        });

        it('should return 404 when ID does not exist', async () => {
            // arrange
            const testID = 2;
            const stubGetById = sandbox.stub(RideManager.prototype, 'getById');
            stubGetById.withArgs(testID).throws(new ObjectNotFound('Could not find any rides'));

            const res = await request(app)
                .get(`/rides/${testID}`)

            expect(res.statusCode).toEqual(404);
            expect(res.body.error_code).toEqual(ErrorCode.RIDES_NOT_FOUND_ERROR);
        })
    })
});