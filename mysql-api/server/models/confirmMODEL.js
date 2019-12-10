const sql = require('../db/db');

exports.confirmToken = (email, token, result) => {
    sql.query('SELECT * FROM `users` WHERE user_mail = ? AND user_token = ?', [email, token], (err, res) => {
        if (err) {
            //console.log(err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

exports.update = (email, result) => {
    sql.query('UPDATE `users` SET `mailverfied`= 1 WHERE user_mail = ?', email, (err, res) => {
        if (err) {
            //console.log(err);
            result(err, null);
        } else {
            if (res.affectedRows)
                sql.query('UPDATE `users` SET user_token = NULL WHERE user_mail = ?', [email]);
            result(null, res);
        }
    });
};