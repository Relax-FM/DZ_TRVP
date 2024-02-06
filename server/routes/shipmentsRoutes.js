const shipmentsRequests = require('../requests/shipmentsRequests');
const cargosRequests = require('../requests/cargosRequests');
const carsRequests = require('../requests/carsRequests')

const {Router} = require("express");
const router = Router();

const logger = require('../logger');


/**
 * Обработка запроса получения всех рейсов
 */
router.get('', async (req, res) => {
    try {
        const shipments = await shipmentsRequests.getShipments();
        for (const shipment of shipments) {
            shipment.cargos = await cargosRequests.getShipmentCargos(shipment.id);
        }
        res.send(shipments);
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }
});

/**
 * Обработка запроса добавления новых грузов
 */
router.post('/add', async(req, res) => {
    const shipmentId = req.body.body.shipment_id;
    const shipmentDestination = req.body.body.shipment_destination;
    const shipmentCar = req.body.body.shipment_car;
    try {
        const carIsBusy = await carsRequests.isBusy(shipmentCar);
        if (carIsBusy) {
            logger.logRequestError('Car is busy', req.cookies.session_id);
            res.statusCode = 422;
            res.send({'error' : 'Car is busy'});
        } else {
            await shipmentsRequests.addShipment(shipmentId, shipmentDestination, shipmentCar);
            res.sendStatus(200);
        }
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }
});

/**
 * Обработка запроса редактирования грузов
 */
router.post('/update', async(req, res) => {
    const shipmentId = req.body.body.shipment_id;
    const shipmentDestination = req.body.body.shipment_destination;
    const shipmentCar = req.body.body.shipment_car;
    try {
        const carIsBusy = await carsRequests.isBusy(shipmentCar, shipmentId);
        if (carIsBusy) {
            logger.logRequestError('Car is busy', req.cookies.session_id);
            res.statusCode = 422;
            res.send({'error' : 'Car is busy'});
        } else {
            await shipmentsRequests.updateShipment(shipmentId, shipmentDestination, shipmentCar);
            res.sendStatus(200);
        }
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }

})

/**
 * Обработка запроса удаления грузов
 */
router.delete('/delete', async(req, res) => {
    const shipmentId = req.body.body.shipment_id;
    try {
        await shipmentsRequests.removeShipment(shipmentId);
        res.sendStatus(200);
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }
});



module.exports = router;
