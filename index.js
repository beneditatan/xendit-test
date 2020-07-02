'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const { RideManager } = require('./src/models');

const buildSchemas = require('./src/schemas');

const winston = require('winston');
 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { 
      server: 'localhost:8010',
      service: 'ride-service' 
    },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

db.serialize(() => {
    buildSchemas(db);
    const rm = new RideManager(db);
    const app = require('./src/app')(db, rm, logger);

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});