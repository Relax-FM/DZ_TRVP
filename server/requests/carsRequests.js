const sql = require('../db/pgSQL');
const setupRequest = require('./setupRequest');

const carsRequestFile = 'cars.sql';
const carShipmentIdRequestFile = 'cars__shipmentId.sql';

/**
 * Класс запросов к автомобилям
 */
class carRequests {
    /**
     * Получить все автомобили
     * @returns {Promise<*|*[]|*[]>} - массив автомобилей
     */
    async getCars() {
        const query = setupRequest.fromFile(carsRequestFile);
        try {
            const data = await sql.makeRequest(query);
            const cars = data.rows;
            return cars;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Проверить, занят ли автомобиль
     * @param carPlate - номер автомобился
     * @param exceptId - id исключаемого рейса. Применяется тогда, когда нужно найти автомобили, на которые можно переназначить рейс.
     * @returns {Promise<boolean>}
     */
    async isBusy(carPlate, exceptId = null) {
            const query = setupRequest.fromFile(carShipmentIdRequestFile, {carPlate});
            try {
                const data = await sql.makeRequest(query);
                if (data.rowCount !== 0) {
                    return data.rows[0].id !== exceptId;
                }
                return false;
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
}

module.exports = new carRequests();
