const {Router} = require('express');
const carRequests = require('../requests/carsRequests');
const router = Router();


/**
 * Обработка запроса получения всех автомобилей
 */
router.get('', async (req, res) => {
    try {
        const cars = await carRequests.getCars();
        res.send(cars);
    } catch (e) {
        res.statusCode = 500;
        res.send({'error': {'sql_error': e.toString()}});
    }
})

module.exports = router;
