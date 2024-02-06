const logger = require('../logger');

/**
 * Промежуточные обработчики
 */
class Middlewares {
    /**
     * Параметры CORS, отсылаемые при каждом запросе
     */
    async corsAll(req, res, next) {
        res.header("Access-Control-Allow-Origin", process.env.FRONTENDURL + ':' + process.env.FRONTENDPORT);
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    };

    /**
     * Логирование запросов
     */
    async logAll(req, res, next) {
        const path = req.path;
        logger.logRequest(req.method, path, req.body, '');
        next();
        logger.logResponse(req.method, path, req.body, res.statusCode, '');
    }
}

module.exports = new Middlewares();
