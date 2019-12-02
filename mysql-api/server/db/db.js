const mysql = require('mysql');
const db = {
    host     : host,
    user     : 'root',
    password : 'matcha123',
    database : 'matcha_db',
    charset  : 'utf8mb4'
};
var sql = mysql.createConnection(db);
sql.connect(err => {
    if (err) throw err;
    //console.log("Connected!");
});
module.exports = sql;