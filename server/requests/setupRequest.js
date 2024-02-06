const path = require('path');
const fs = require('fs');

/**
 * Класс создания запросов с параметрами
 */
class SetupRequest {
    /**
     * Получить запрос по имени файла и параметрам
     * @param fileName - имя файла с текстом запроса
     * @param params - параметры запроса
     * @returns {any} - полученный запрос
     */
    fromFile(fileName, params) {
        const filePath = path.join(__dirname, '/sql/', fileName);
        const req = fs.readFileSync(filePath);
        const reqStr = Buffer.from(req).toString();
        const request = eval(`\`${reqStr}\``);
        console.log(request);
        return request;
    }
}

module.exports = new SetupRequest();
