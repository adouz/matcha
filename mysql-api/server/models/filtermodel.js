const sql = require('../db/db');

exports.getUsers = function (username) {
    return new Promise((resolve, reject) => {
    sql.query("select user_id,user_name, user_fullname, TIMESTAMPDIFF(YEAR, user_birthdate, CURDATE()) AS user_age, user_gender, user_bio, user_prefer, user_popularity, user_addresse,longitude,latitude,user_mail from users where user_name not in (select matched from matches where matched like ? or matcher like ? )and user_name not in (select matcher from matches where matched like ? or matcher like ?) and user_bio is not null  and user_gender is not null and user_prefer is not null and user_id in (select user_id from images where image_type like 'profil')", [username,username,username,username,username], function (err, res) {
        if (err) 
            reject(err);
        else 
            resolve(res);
    })
    })
};