'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('../docs/docs');

const { calculateLimitAndOffset, paginate } = require('paginate-info');

const { ErrorCode } = require('./core');
const APIValidator = require('./api/validator');

module.exports = (db, rm) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, async (req, res) => {
        const rideObj = {
            startLat: Number(req.body.startLat),
            startLong: Number(req.body.startLong),
            endLat: Number(req.body.endLat),
            endLong: Number(req.body.endLong),
            riderName: req.body.riderName,
            driverName: req.body.driverName,
            driverVehicle: req.body.driverVehicle,
        }

        try {
            APIValidator.validatePostRideRequest(rideObj);
        } catch (error) {
            res.status(400);
            return res.send({
                error_code: error.errorCode,
                message: error.message
            })
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

    app.get('/rides', jsonParser, async (req, res) => {
        const { currentPage, pageSize } = req.body;
        const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);
        
        let rowsData;
        try {
            rowsData = await rm.getAll({ limit, offset });
        } catch (error) {
            res.status(500);
            res.send({
                error_code: ErrorCode.SERVER_ERROR,
                message: 'Unknown error'
            });
        }

        const obj = rowsData.resArray;
        const count = rowsData.count;
        if (obj.length > 0) {
            const meta = paginate(currentPage, count, obj, pageSize);
            res.status(200);
            res.send({ rows: obj, meta });
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
