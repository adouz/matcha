const sql = require('../db/db');

exports.addVisite = (user_visited, username, result) => {
    sql.query("INSERT INTO `visite_history` (`user_visited`, `user`,`time`) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE time = NOW()", [user_visited, username], (err, res) => {
        if (err){
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
}

exports.getVisites =  function (username) {
    return new Promise((resolve, reject) => {
            sql.query("SELECT user,DATE_FORMAT(time,'%d/%m/%Y') as 'date',DATE_FORMAT(time,'%h:%i') as 'time'  FROM `visite_history` WHERE `user_visited` = ? order by timestamp(time) desc",[username], (err, res) => {
        if (err) 
            reject(err);
        else 
            resolve(res);
    })
    })
}