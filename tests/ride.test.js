'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('../src/schemas');
const assert = require('assert');

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
	
	describe('#save()', () => {
		it('should write model to db table successfully given valid data', (done) => {
			// arrange
			const rideObj = new Ride(db);
			rideObj.setStartLat(-6.347617);
			rideObj.setStartLong(106.826691);
			rideObj.setEndLat(-6.193758);
			rideObj.setEndLong(106.801613);
			rideObj.setRiderName('Benedita');
			rideObj.setDriverName('Samuel');
			rideObj.setDriverVehicle('Toyota Avanza');

			// act
			rideObj.save().then((res) => {
				// assert
				assert.equal(res, true);
			});
		});
	});
});