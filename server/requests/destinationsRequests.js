const sql = require("../db/pgSQL");
const setupRequest = require('./setupRequest');

const getDestinationsRequestFile = 'destinations.sql';

/**
 * Класс запросов к пунктам назначения
 */
class DestinationsRequests {
    /**
     * Получить все возможные пункты назначения
     * @returns {Promise<*>} - все возможные пункты назначения
     */
    async getDestinations() {
        const query = setupRequest.fromFile(getDestinationsRequestFile, {});
        try {
            const data = await sql.makeRequest(query);
            return data.rows;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

module.exports = new DestinationsRequests();
