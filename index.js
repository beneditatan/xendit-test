'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const { RideManager } = require('./src/models');
const { logger } = require('./src/core');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
    buildSchemas(db);
    const rm = new RideManager(db);
    const app = require('./src/app')(db, rm, logger);

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});