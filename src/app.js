'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('../docs/docs');

const { Ride, RideManager } = require('./models');
const { ErrorCode } = require('./core');

module.exports = (db, rm) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, async (req, res) => {
        const startLatitude = Number(req.body.startLat);
        const startLongitude = Number(req.body.startLong);
        const endLatitude = Number(req.body.endLat);
        const endLongitude = Number(req.body.endLong);
        const riderName = req.body.riderName;
        const driverName = req.body.driverName;
        const driverVehicle = req.body.driverVehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            res.status(400);
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        // var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
        
        // const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
        //     if (err) {
        //         return res.send({
        //             error_code: 'SERVER_ERROR',
        //             message: 'Unknown error'
        //         });
        //     }

        //     db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
        //         if (err) {
        //             return res.send({
        //                 error_code: 'SERVER_ERROR',
        //                 message: 'Unknown error'
        //             });
        //         }

        //         res.send(rows);
        //     });
        // });
        const rideObj = {
            startLat: startLatitude,
            startLong: startLongitude,
            endLat: endLatitude,
            endLong: endLongitude,
            riderName: riderName,
            driverName: driverName,
            driverVehicle: driverVehicle,
        }

        try {
            const savedObj = await rm.save(rideObj);
            res.status(200);
            res.send(savedObj.toJSON());
        } catch (error) {
            res.status(500)
            return res.send({
                error_code: ErrorCode.SERVER_ERROR,
                message: 'Unknown error'
            });
        }
    });

    app.get('/rides', async (req, res) => {
        let obj;
        try {
            obj = await rm.getAll();
        } catch (error) {
            res.status(500);
            res.send({
                error_code: ErrorCode.SERVER_ERROR,
                message: 'Unknown error'
            });
        }

        if (obj.length > 0) {
            res.status(200);
            res.send(obj);
        } else {
            res.status(404);
            res.send(
                {
                    error_code: ErrorCode.RIDES_NOT_FOUND_ERROR,
                    message: 'Could not find any rides'
                }
            )
        }
    });

    app.get('/rides/:rideID', async (req, res) => {
        const id = parseInt(req.params.rideID);
        let obj;
        try {
            obj = await rm.getById(id);
            res.status(200);
            res.send(obj);
        } catch (err) {
            // console.log(err);
            if (err.constructor.name === "ObjectNotFound") {
                res.status(404);
                res.send(
                    {
                        error_code: err.errorCode,
                        message: 'Could not find any rides'
                    }
                )
            } else {
                res.status(500);
                res.send({
                    error_code: ErrorCode.SERVER_ERROR,
                    message: 'Unknown error'
                });
            }
        }

    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

    return app;
};
