const pino = require('pino');

/**
 * Класс логирования
 */
class Logger {
    constructor() {
        const transport = pino.transport({
            target: 'pino-pretty',
            options: { destination: 1 } // use 2 for stderr
        })
        this.loggerTool = pino(transport);
    }

    /**
     * Логирование старта сервера
     */
    logStartup() {
        this.loggerTool.info({'port': Number(process.env.PORT)}, 'Server started')
    }

    /**
     * Логирование запроса
     * @param type - тип запроса
     * @param endpoint - куда направлен запрос
     * @param payload - тело запроса
     * @param sessionId - id сессии автора запроса
     */
    logRequest(type, endpoint, payload, sessionId) {
        this.loggerTool.info({'type': type, 'endpoint': endpoint, 'payload': payload, 'sessionId': sessionId}, 'Request received');
    }

    /**
     * Логирование ответа
     * @param type - тип исходного запроса
     * @param endpoint - куда был направлен исходный запрос
     * @param payload - тело исходного запроса
     * @param status - статус запроса
     * @param sessionId - id cессии автора запроса
     * @param errorText - ошибка при выполнении запроса (при наличии)
     */
    logResponse(type, endpoint, payload, status, sessionId, errorText) {
        this.loggerTool.info({'type': type, 'endpoint': endpoint, 'payload': payload, 'code': status, 'sessionId': sessionId, 'errorText': errorText}, 'Response written');
    }

    /**
     * Логирование SQL-запроса
     * @param query SQL- запрос
     */
    logSqlQuery(query) {
        this.loggerTool.info({'query': query}, 'SQL request');
    }

    /**
     * Логирование запроса к redis
     * @param type - тип запроса
     * @param key - переданный ключ
     * @param value - переданное значение (при наличии)
     */
    logRedisQuery(type, key, value = undefined) {
        this.loggerTool.info({'type': type, 'key': key, 'value': value}, 'Redis request');
    }

    /**
     * Логирование ошибки БД SQL
     * @param error - текст ошибки
     */
    logSqlError(error) {
        this.loggerTool.error({'trace': error}, 'SQL error');
    }

    /**
     * Логирование ошибки БД redis
     * @param error - текст ошибки
     */
    logRedisError(error) {
        this.loggerTool.error({'trace': error}, 'Redis error');
    }

    /**
     * Логирование ошибки при выполнении запроса
     * @param error - текст ошибки
     * @param sessionId - id сессии автора запроса
     */
    logRequestError(error, sessionId) {
        this.loggerTool.info({'error': error, 'sessionId': sessionId}, 'Request error');
    }
}

module.exports = new Logger();
