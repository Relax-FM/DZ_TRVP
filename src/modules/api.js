import { restEndpoints, backendUrl } from '@configs/rest_config.js';
import { Requests } from './requests.js';

/**
 * Класс запросов к REST API
 * @class
 */
export class Api extends Requests {
  /**
   * Получить все автомобили
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async getCars() {
    const endpoint = restEndpoints.getCars;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  /**
   * Получить все рейсы
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async getShipments() {
    const endpoint = restEndpoints.getShipments;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }

  /**
   * Добавить груз
   * @param cargo_id - сгенерированный uuid груза
   * @param shipment_id - id рейса
   * @param cargo_amount - количество груза
   * @param cargo_volume - объём 1 единицы груза
   * @param cargo_name - имя груза
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async addCargo(cargo_id, shipment_id, cargo_amount, cargo_volume, cargo_name) {
    const endpoint = restEndpoints.addCargo;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {cargo_id, shipment_id, cargo_amount, cargo_volume, cargo_name});
  }

  /**
   * Добавить рейс
   * @param shipment_id - сгенерированный uuid рейса
   * @param shipment_destination - пункт назначения рейса
   * @param shipment_car - номер автомобиля рейса
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async addShipment(shipment_id, shipment_destination, shipment_car) {
    const endpoint = restEndpoints.addShipment;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {shipment_id, shipment_destination, shipment_car});
  }

  /**
   * Удаление груза
   * @param cargo_id - id груза
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async removeCargo(cargo_id) {
    const endpoint = restEndpoints.removeCargo;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {cargo_id});
  }

  /**
   * Удаление рейса
   * @param shipment_id - id рейса
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async removeShipment(shipment_id) {
    const endpoint = restEndpoints.removeShipment;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {shipment_id});
  }

  /**
   * Редактирование рейса
   * @param shipment_id - id рейса
   * @param shipment_destination - новый пункт назначений рейса
   * @param shipment_car - новый номер машины рейса
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async updateShipment(shipment_id, shipment_destination, shipment_car) {
    const endpoint = restEndpoints.updateShipment;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {shipment_id, shipment_destination, shipment_car});
  }

  /**
   * Редактирование груза
   * @param cargo_id - id груза
   * @param cargo_amount - новое количество груза
   * @param cargo_volume - новый объём 1 единицы груза
   * @param cargo_name - новое имя груза
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async updateCargo(cargo_id, cargo_amount, cargo_volume, cargo_name) {
    const endpoint = restEndpoints.updateCargo;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {cargo_id, cargo_amount, cargo_volume, cargo_name});
  }

  /**
   * Перенос груза
   * @param cargo_id - id груза
   * @param new_shipment_id - id нового рейса
   * @param old_shipment_id - id старого рейса
   * @param cargo_amount - количество груза
   * @param cargo_volume - объём 1 единицы груза
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async moveCargo(cargo_id, new_shipment_id, old_shipment_id, cargo_amount, cargo_volume) {
    const endpoint = restEndpoints.moveCargo;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method, {cargo_id, new_shipment_id, old_shipment_id, cargo_amount, cargo_volume});
  }

  /**
   * Получение всех возможных пунктов назначения
   * @returns {Promise<{data: *, status: number}|{data: null, status: number}>} - результат запроса и статус
   */
  async getDestinations() {
    const endpoint = restEndpoints.getDestination;
    const url = backendUrl + endpoint.url;
    return this.make_request(url, endpoint.method);
  }
}
