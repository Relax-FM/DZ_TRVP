const sql = require("../db/pgSQL");
const setupRequest = require('./setupRequest');

const shipmentCargosRequestFile = 'cargos__shipmentCargos.sql';
const addCargoRequestFile = 'cargos__addCargo.sql';
const getCargoShipmentIdRequestFile = 'cargos__getCargoShipmentId.sql';
const moveCargoRequestFile = 'cargos__moveCargo.sql';
const updateCargoRequestFile = 'cargos__updateCargo.sql';
const deleteCargoRequestFile = 'cargos__deleteCargo.sql';

/**
 * Класс запросов к грузам
 */
class CargosRequests {
    /**
     * Получить все грузы с определённого рейса
     * @param shipmentId - id рейса
     * @returns {Promise<*>} - грузы рейса
     */
    async getShipmentCargos(shipmentId) {
        const query = setupRequest.fromFile(shipmentCargosRequestFile, {shipmentId: shipmentId});
        try {
            const data = await sql.makeRequest(query);
            return data.rows;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Добавить груз
     * @param cargoId - uuid груза (генерируется на фронте)
     * @param shipmentId - id рейса
     * @param amount - количество груза
     * @param volume - объём 1 единицы груза
     * @param name - имя груза
     * @returns {Promise<void>}
     */
    async addCargo(cargoId, shipmentId, amount, volume, name) {
        const query = setupRequest.fromFile(addCargoRequestFile, {cargoId, shipmentId, amount, volume, name});
        try {
            await sql.makeRequest(query);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Получить id рейса по id груза
     * @param cargoId - id груза
     * @returns {Promise<*>} - id рейса
     */
    async getCargoShipmentId(cargoId) {
        const query = setupRequest.fromFile(getCargoShipmentIdRequestFile, {cargoId});
        try {
            const result = await sql.makeRequest(query);
            return result.rows[0].shipment_id;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Перенести груз с рейса на рейс
     * @param cargoId - id груза
     * @param newShipmentId - id нового рейса
     * @returns {Promise<void>} - результат запроса
     */
    async moveCargo(cargoId, newShipmentId) {
        const query = setupRequest.fromFile(moveCargoRequestFile, {cargoId, newShipmentId});
        try {
            await sql.makeRequest(query);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Изменить груз
     * @param cargoId - id груза
     * @param amount - новое количество груза
     * @param volume - новый объём 1 единицы груза
     * @param name - новое имя груза
     * @returns {Promise<void>}
     */
    async updateCargo(cargoId, amount, volume, name) {
        const query = setupRequest.fromFile(updateCargoRequestFile, {cargoId, amount, volume, name});
        try {
            await sql.makeRequest(query);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Удалить груз
     * @param cargoId - id груза
     */
    async removeCargo(cargoId) {
        const query = setupRequest.fromFile(deleteCargoRequestFile, {cargoId});
        try {
            await sql.makeRequest(query);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

module.exports = new CargosRequests();
