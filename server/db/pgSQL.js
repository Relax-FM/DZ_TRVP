const {Pool} = require('pg');
const logger = require('../logger');


/**
 * Класс-адаптер для PostgreSQL
 */
class pgAdapter {
    constructor(config = {}) {
        this.host = config.host || process.env.SQLHOST;
        this.port = config.port || process.env.SQLPORT;
        this.dbName = config.dbName || process.env.SQLDBNAME;
        this.userName = config.userName || process.env.SQLUSER;
        this.password = config.password || process.env.SQLPASSWORD;
        this.pgPool = new Pool({
            host: this.host,
            port: this.port,
            database: this.dbName,
            user: this.userName,
            password: this.password,
        });
    }

    /**
     * Создание подключения к бд
     * @returns {Promise<Dispatcher.ConnectData>} - объект подключения
     */
    async connect() {
        try {
            return await this.pgPool.connect();
        } catch (e) {
            logger.logSqlError(e.toString());
            throw e;
        }
    }

    /**
     * Отключение от бд
     * @param connection - существующее подключение
     * @returns {Promise<void>}
     */
    async disconnect(connection) {
        await connection.end();
    }

    /**
     * Выполнение единичного запроса
     * @param query - текст запроса
     * @param connection - подключение (если запрос - часть транзакции)
     * @returns {Promise<void>} - результат выполнения запроса
     */
    async makeRequest(query, connection = null) {
        logger.logSqlQuery(query);
        try {
            if (!connection) {
                return await this.pgPool.query(query);
            } else {
                return await connection.query(query);
            }
        } catch (e) {
            logger.logSqlError(e.toString());
            throw e;
        }
    }

    /**
     * Выполнение транзакции
     * @param queries - запросы, из которых состоит транзакция
     * @returns {Promise<void>} - результат транзакции
     */
    async makeTransaction(queries) {
        logger.logSqlQuery(queries);
        let connection = null;
        try {
            connection = await this.connect();
            await connection.query('BEGIN');
        } catch (e) {
            logger.logSqlError(e.toString());
            await this.disconnect(connection);
            throw e;
        }
        for (const query of queries) {
            try {
                await this.makeRequest(query, connection);
            } catch (e) {
                logger.logSqlError(e.toString());
                await connection.query('ROLLBACK');
                await this.disconnect(connection);
                throw e;
            }
        }
        try {
            await connection.query('COMMIT');
        } catch (e) {
            logger.logSqlError(e.toString());
            await connection.query('ROLLBACK');
            throw e;
        } finally {
            await this.disconnect(connection);
        }
    }
}

module.exports = new pgAdapter();
