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

module.exports = (db, rm, logger) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, async (req, res) => {
        logger.info(`${new Date()} - POST /rides`);
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
            logger.error(`${new Date()} POST /rides - ${error.errorCode} - ${error.message}`);
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
            logger.error(`${new Date()} POST /rides - ${ErrorCode.SERVER_ERROR} - ${error.message}`);
            res.status(500)
            return res.send({
                error_code: ErrorCode.SERVER_ERROR,
                message: error.message
            });
        }
    });

    app.get('/rides', jsonParser, async (req, res) => {
        logger.info(`${new Date()} - GET /rides`);
        const { currentPage, pageSize } = req.body;
        const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);
        
        let rowsData;
        try {
            rowsData = await rm.getAll({ limit, offset });
        } catch (error) {
            logger.error(`${new Date()} GET /rides - ${ErrorCode.SERVER_ERROR} - ${error.message}`);
            res.status(500);
            res.send({
                error_code: ErrorCode.SERVER_ERROR,
                message: error.message
            });
        }

        const obj = rowsData.resArray;
        const count = rowsData.count;
        if (obj.length > 0) {
            const meta = paginate(currentPage, count, obj, pageSize);
            res.status(200);
            res.send({ rows: obj, meta });
        } else {
            const errMsg = 'Could not find any rides';
            logger.error(`${new Date()} GET /rides - ${ErrorCode.RIDES_NOT_FOUND_ERROR} - ${errMsg}`);
            res.status(404);
            res.send(
                {
                    error_code: ErrorCode.RIDES_NOT_FOUND_ERROR,
                    message: errMsg
                }
            )
        }
    });

    app.get('/rides/:rideID', async (req, res) => {
        logger.info(`${new Date()} - GET /rides/:rideID`);
        const id = parseInt(req.params.rideID);
        let obj;
        try {
            obj = await rm.getById(id);
            res.status(200);
            res.send(obj);
        } catch (err) {
            if (err.constructor.name === "ObjectNotFound") {
                logger.error(`${new Date()} GET /rides/:rideID - ${err.errorCode} - ${err.message}`);
                res.status(404);
                res.send(
                    {
                        error_code: err.errorCode,
                        message: err.message
                    }
                )
            } else {
                logger.error(`${new Date()} GET /rides/:rideID - ${ErrorCode.SERVER_ERROR} - ${err.message}`);
                res.status(500);
                res.send({
                    error_code: ErrorCode.SERVER_ERROR,
                    message: err.message
                });
            }
        }

    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

    return app;
};
