import {TIMEOUT_RESPONSE} from "@configs/common_config";

const noBodyRequests = ['GET', 'HEAD'];
const UNAUTHORISED_CODE = 401;

/**
 * Класс для создания запросов в Интернет
 * @class
 */
export class Requests {
  /**
     * Функция для создания запроса
     * @param url - url для отправки запроса
     * @param method - метод запроса
     * @param data - тело запроса (null если не требуется)
     * @returns {Promise<{data: any, status: number}|{data: null, status: number}>} -
     * результат запроса и статус
     */
  async make_request(url, method, data = null) {
    const params = {
      method,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (!noBodyRequests.includes(method)) {
      params.body = JSON.stringify({ body: data });
    }

    const response = await fetch(url, params);

    try {
      const responseJson = await response.json();
      if ((response.status === UNAUTHORISED_CODE) && (window.location.pathname !== '/login')) {
        window.router.redirect('/login');
      }
      return {
        status: response.status,
        data: responseJson,
      };
    } catch (e) {
      if ((response.status === TIMEOUT_RESPONSE) && (window.location.pathname !== '/login')) {
        alert('Превышен лимит запросов к базе данных');
      }
      return {
        status: response.status,
        data: null,
      };
    }
  }
}
