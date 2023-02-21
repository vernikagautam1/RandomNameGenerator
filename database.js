//const connection = require('../config/databaseconnection') //for connecting database
let mysql = require("mysql2");

let connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'vernika@9168',
    database: 'random_names',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

});
module.exports = connection.promise();