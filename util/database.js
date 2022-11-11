const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    yser: 'root',
    database: 'node_complete',
    password: 'kirtimish.8383'
})

module.exports = pool.promise();