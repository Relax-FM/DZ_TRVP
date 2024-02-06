import path from "path";
import fs from "fs";
const sql = require("../pgSQL");

const fileName = process.argv[2];

/**
 * Запускает миграции из переданного аргументом командной строки файла.
 */

if (fileName === null) {
    console.log('Missing migration file name');
} else {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, function(error, data){
        if (error) {
            return console.log(error);
        }
        const query = data.toString();
        sql.makeRequest(query);
        console.log(request);
    });
}

