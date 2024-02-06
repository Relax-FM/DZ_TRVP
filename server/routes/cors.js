const middlewares = require('../middlewares/middlewares');

const {Router} = require("express");
const router = Router();

router.use(middlewares.corsAll);

/**
 * Обработка preflight options-запроса для cors
 */
router.options('*', function (req, res) {
    res.header("Access-Control-Allow-Origin", 'http://192.168.1.100:8000');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.send();
});

module.exports = router;
