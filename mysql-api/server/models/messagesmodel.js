const sql = require('../db/db');

// exports.matches = (username, result) => {
//     sql.query("select matched, matcher, room from matches where (matched or matcher) = ?",[username], (err, res) => {
//         if(err) {
//             console.log("error: ", err);
//             result(err, null);
//         }
//         else{
//                 result(null, res);
//         }

//     })
// }

exports.matches =  function (username) {
    return new Promise((resolve, reject) => {
            sql.query("select distinct matched, matcher, room from matches where matched like ? or matcher like ?",[username, username], (err, res) => {
        if (err) 
            reject(err);
        else 
            resolve(res);
    })
    })
}

exports.addMessage = (data, result) => {
    sql.query("INSERT INTO `messages` (`from`, `to`, `msg`, `room`, `time`) VALUES (?, ?, ?, ?, NOW())", [data.from, data.to, data.msg, data.room], (err, res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
}

exports.getProfilInfo = function (username) {
    return new Promise((resolve, reject) => {
        sql.query("select concat(? ,image_path) as 'imgurl',TIMESTAMPDIFF(YEAR, user_birthdate, CURDATE()) AS user_age,user_bio,user_popularity,user_addresse,user_gender,user_fullname from images,users where image_type like 'PROFIL' and images.user_id=users.user_id and user_name like ?", ["http://"+host+":3000",username], function (err, info) {
        if (err) 
            reject(err);
        else
            resolve(info);
    })
    })
}

/*exports.getProfilImage =  (username, result) => {
    sql.query("select concat(? ,image_path) as 'imgurl' from images where image_type like 'PROFIL' and user_id in (select user_id from users where user_name like ?)", ["http://localhost:3000",username], function (err, res) {
        if (err) {
            result(err, null);
        }
        else {
            result(null ,res);
        }
    });
};
*/
exports.getMessages = (room, result) => {
    sql.query("SELECT * FROM `messages` WHERE `room` = ?", [room], (err, res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
        }else{
            result(null, res);
        }
    });
}