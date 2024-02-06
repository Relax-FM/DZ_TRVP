const sql = require('../db/pgSQL');
const setupRequest = require('./setupRequest');

const shipmentsRequestFile = 'shipments.sql';
const addShipmentRequestFile = 'shipments__add.sql';
const updateShipmentRequestFile = 'shipments__update.sql';
const removeShipmentRequestFile = 'shipments__remove.sql';
const shipmentCargoWeightRequestFile = 'shipments__cargoWeight.sql';
const shipmentCargoWeightWoutRequestFile = 'shipments__cargoWeightWout.sql';
const shipmentTotalPlacesRequestFile = 'shipments__totalPlaces.sql';
const shipmentDestinationRequestFile = 'shipments__destination.sql';
const shipmentPlacesAndDestinationRequestFile = 'shipments__placesAndDestination.sql';

/**
 * Класс запросов к рейсам
 */
class ShipmentsRequests {
    /**
     * Получить все рейсы
     * @returns {Promise<*>} - все рейсы
     */
    async getShipments() {
        const query = setupRequest.fromFile(shipmentsRequestFile);
        try {
            const shipments = await sql.makeRequest(query);
            return shipments.rows;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Добавить рейс
     * @param id - uuid рейса (генерируется на фронте)
     * @param destination - id пункта назначения
     * @param carPlate - номер автомобиля
     */
    async addShipment(id, destination, carPlate) {
        const query = setupRequest.fromFile(addShipmentRequestFile, {id, destination, carPlate});
        try {
            await sql.makeRequest(query);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Редактирование рейса
     * @param id - новый uuid рейса (генерируется на фронте)
     * @param destination - новый id пункта назначения
     * @param carPlate - новый номер автомобиля
     */
    async updateShipment(id, destination, carPlate) {
        const query = setupRequest.fromFile(updateShipmentRequestFile, {id, destination, carPlate});
        try {
            await sql.makeRequest(query);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Удаление рейса
     * @param shipmentId - id рейса
     */
    async removeShipment(shipmentId) {
        const cargoQuery = setupRequest.fromFile(removeShipmentRequestFile, {shipmentId});
        const query = `DELETE FROM shipments WHERE id = '${shipmentId}'`;
        try {
            await sql.makeTransaction([cargoQuery, query]);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Посчитать вес всех грузов в рейсе
     * @param shipmentId - id рейса
     * @returns {Promise<number>} - вес всех грузов в рейсе
     */
    async cargoWeight(shipmentId) {
        const query = setupRequest.fromFile(shipmentCargoWeightRequestFile, {shipmentId});
        try {
            const data = await sql.makeRequest(query);
            return Number(data.rows[0].sum);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    /**
     * Посчитать вес всех грузов в рейсе без учёта одного
     * @param shipmentId - id рейса
     * @param cargoId - id исключаемого груза. Применяется тогда, когда нужно пересчитать свободное место в автомобиле при редактировании груща
     * @returns {Promise<number>} - вес всех грузов в рейсе
     */
    async cargoWeightWithout(shipmentId, cargoId) {
        const query = setupRequest.fromFile(shipmentCargoWeightWoutRequestFile, {shipmentId, cargoId});
        try {
            const data = await sql.makeRequest(query);
            return Number(data.rows[0].sum);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Получить вместимость назначенного на рейс автомобиля
     * @param shipmentId - id рейса
     * @returns {Promise<number>} - вместимость назначенного на рейс автомобиля
     */
    async totalPlaces(shipmentId) {
        const query = setupRequest.fromFile(shipmentTotalPlacesRequestFile, {shipmentId});
        try {
            const data = await sql.makeRequest(query);
            return Number(data.rows[0].load);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Получить вместимость назначенного на рейс автомобиля и пункт назначения рейса
     * @param shipmentId - id рейса
     * @returns {Promise<*>} - вместимость назначенного на рейс автомобиля и пункт назначения рейса
     */
    async placesAndDestination(shipmentId) {
        const query = setupRequest.fromFile(shipmentPlacesAndDestinationRequestFile, {shipmentId});
        try {
            const data = await sql.makeRequest(query);
            return data.rows[0];
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Получить пункт назначения рейса
     * @param shipmentId - id рейса
     * @returns {Promise<*>} - пункт назначения рейса
     */
    async getDestination(shipmentId) {
        const query = setupRequest.fromFile(shipmentDestinationRequestFile, {shipmentId});
        try {
            const data = await sql.makeRequest(query);
            return data.rows[0].destination;
        } catch (e) {
            console.log(e);
            throw e;
        }

    }
}

module.exports = new ShipmentsRequests();
