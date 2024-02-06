const shipmentsRequests = require('../requests/shipmentsRequests');
const cargosRequests = require('../requests/cargosRequests');
const {Router} = require("express");
const router = Router();

const logger = require("../logger");

/**
 * Обработка запроса добавления груза
 */
router.post('/add', async(req, res) => {
    const cargoId = req.body.body.cargo_id;
    const shipmentId = req.body.body.shipment_id;
    const amount = req.body.body.cargo_amount;
    const volume = req.body.body.cargo_volume;
    const name = req.body.body.cargo_name;
    try {
        const placeTotal = await shipmentsRequests.totalPlaces(shipmentId);
        const placeBusy = await shipmentsRequests.cargoWeight(shipmentId);
        if ((placeTotal-placeBusy) < (Number(amount) * Number(volume))) {
            logger.logRequestError('Cargo is too big', req.cookies.session_id);
            res.statusCode = 422;
            res.send({'error' : 'Cargo is too big'});
        } else {
            await cargosRequests.addCargo(cargoId, shipmentId, amount, volume, name);
            res.sendStatus(200);
        }
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }
});

/**
 * Обработка запроса редактирования груза
 */
router.post('/update', async (req, res) => {
    const cargoId = req.body.body.cargo_id;
    const amount = req.body.body.cargo_amount;
    const volume = req.body.body.cargo_volume;
    const name = req.body.body.cargo_name;
    try {
        const shipmentId = await cargosRequests.getCargoShipmentId(cargoId);
        const placeTotal = await shipmentsRequests.totalPlaces(shipmentId);
        const placeBusy = await shipmentsRequests.cargoWeightWithout(shipmentId, cargoId);
        if ((placeTotal-placeBusy) < (Number(amount) * Number(volume))) {
            logger.logRequestError('Cargo is too big', req.cookies.session_id);
            res.statusCode = 422;
            res.send({'error' : 'Cargo is too big'});
        } else {
            await cargosRequests.updateCargo(cargoId, amount, volume, name);
            res.sendStatus(200);
        }
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }
});

/**
 * Обработка запроса переназначения груза
 */
router.post('/move', async (req, res) => {
    const cargoId = req.body.body.cargo_id;
    const newShipmentId = req.body.body.new_shipment_id;
    const oldShipmentId = req.body.body.old_shipment_id;
    const amount = req.body.body.cargo_amount;
    const volume = req.body.body.cargo_volume;
    try {
        const shipmentId = await cargosRequests.getCargoShipmentId(cargoId);
        const placeAndDestination = await shipmentsRequests.placesAndDestination(shipmentId);
        const placeTotal = Number(placeAndDestination.load);
        const destination = placeAndDestination.destination;
        const oldDestination = await shipmentsRequests.getDestination(oldShipmentId);
        const placeBusy = await shipmentsRequests.cargoWeight(shipmentId);
        if ((placeTotal-placeBusy) < (Number(amount) * Number(volume))) {
            logger.logRequestError('Cargo is too big', req.cookies.session_id);
            res.statusCode = 422;
            res.send({'error' : 'Cargo is too big'});
        } else if (destination !== oldDestination) {
            logger.logRequestError('Destinations don\'t match', req.cookies.session_id);
            res.statusCode = 422;
            res.send({'error' : 'Destinations don\'t match'});
        } else {
            await cargosRequests.moveCargo(cargoId, newShipmentId);
            res.sendStatus(200);
        }
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }

});

/**
 * Обработка запроса удаления груза
 */
router.delete('/delete', async (req, res) => {
    const cargoId = req.body.body.cargo_id;
    try {
        await cargosRequests.removeCargo(cargoId);
        res.sendStatus(200);
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }
});

module.exports = router;
