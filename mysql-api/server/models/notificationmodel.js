const sql = require('../db/db');

exports.addNotification = (data, result) => {
    sql.query("INSERT INTO `notification` (user, title, msg, time) VALUES (?, ?, ?, NOW())", [data.user, data.title, data.msg], (err, res) => {
        if (err){
            //console.log(err);
            result(err, null);
        }else{
            result(null, res);
        }
    });
}

exports.getNotification = (username, result) => {
    sql.query("SELECT * FROM `notification` WHERE user = ? ORDER BY notification_id DESC", [username], (err, res) => {
        if (err){
            //console.log(err);
            result(err, null)
        }else{
            result(null,res)
        }
    });
}

exports.setAllNotification = (username, result) => {
    sql.query('UPDATE `notification` SET `read` = 0 WHERE `user` = ?', [username], (err, res) => {
        if (err){
            //console.log(err);
            result(err, null);
        }else
            result(null, res);
    })
}

exports.newNotification = (username, result) => {
    sql.query("SELECT * FROM `notification` WHERE user = ? AND `read` = 1", [username], (err, res) => {
        if (err){
            //console.log(err);
            result(err, null)
        }   
           else{
            result(null,res)
        }
    });
}
