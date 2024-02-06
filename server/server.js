'use strict';

const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config();

const middlewares = require('./middlewares/middlewares');

const logger = require('./logger');

const port = process.env.PORT || 8001;

app.use(middlewares.logAll);

app.use('', require('./routes/cors'));
app.use('/api/v1/cars', require('./routes/carsRoutes'));
app.use('/api/v1/cargos', require('./routes/cargosRoutes'));
app.use('/api/v1/shipments', require('./routes/shipmentsRoutes'));
app.use('/api/v1/destinations', require('./routes/destinationsRoutes'));


app.listen(port, function () {
    logger.logStartup();
});
