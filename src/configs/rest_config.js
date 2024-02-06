const GET_METHOD = 'GET';
const POST_METHOD = 'POST';
const DELETE_METHOD = 'DELETE';

/**
 * URL для всех REST-запросов
 * @type {string}
 */

export const url = '192.168.1.100';
export const backendPort = '8001';
export const protocol = 'http';
export const apiVersion = '1';
export const backendUrl = protocol + '://' + url + ':' + backendPort + '/api/v' + apiVersion;
/**
 * Все возможные endpoint'ы и их методы
 */
export const restEndpoints = {
  getCars: {
    url: '/cars',
    method: GET_METHOD,
  },
  getShipments: {
    url: '/shipments',
    method: GET_METHOD,
  },
  removeCargo: {
    url: '/cargos/delete',
    method: DELETE_METHOD,
  },
  removeShipment: {
    url: '/shipments/delete',
    method: DELETE_METHOD,
  },
  addCargo: {
    url: '/cargos/add',
    method: POST_METHOD,
  },
  addShipment: {
    url: '/shipments/add',
    method: POST_METHOD
  },
  updateShipment: {
    url: '/shipments/update',
    method: POST_METHOD,
  },
  updateCargo: {
    url: '/cargos/update',
    method: POST_METHOD,
  },
  moveCargo : {
    url: '/cargos/move',
    method: POST_METHOD,
  },
  getDestination: {
    url: '/destinations',
    method: GET_METHOD,
  }
};
