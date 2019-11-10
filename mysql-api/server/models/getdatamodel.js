const sql = require('../db/db');
exports.user_profile = function(username, result){
    sql.query("SELECT user_id,user_name, user_fullname, TIMESTAMPDIFF(YEAR, user_birthdate, CURDATE()) AS user_age, user_gender, user_bio, user_prefer, user_popularity, user_addresse,longitude,latitude,user_mail FROM `users` WHERE user_name = ?", username, function (err, res) {
        if (err){
            console.log(err);
            result(err, null);
        }else{
            result(null, res);
        }
    })
};