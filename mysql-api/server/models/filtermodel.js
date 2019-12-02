const sql = require('../db/db');

exports.getUsers = function (username,user_prefer) {
    return new Promise((resolve, reject) => {
            sql.query("select distinct user_name from users,images where users.user_id = images.user_id and image_type like 'profil' and user_bio is not null  and user_gender is not null and user_prefer is not null and user_gender REGEXP ? and not exists (select * from likes where liker_user like ? and liked_user like user_name) and not exists (select * from blocks where (blocked_user like user_name and blocker_user like ?) or (blocker_user like user_name and blocked_user like ?)) and user_name not like ?", [user_prefer,username,username,username,username], function (err, res) {
                if (err) 
                    reject(err);
                else 
                resolve(res);
            })
        })
};

// exports.getUsers = function (username,user_prefer) {
//     return new Promise((resolve, reject) => {
//             sql.query("select distinct user_name from users,images where users.user_id = images.user_id and image_type like 'profil' and user_bio is not null  and user_gender is not null and user_prefer is not null and user_gender REGEXP ? and user_name not in (select liked_user from likes where liker_user like ?) and user_name not in (select blocker_user from blocks where blocked_user like ? ) and user_name not in (select blocked_user from blocks where blocker_user like ?) and user_name not like ?", [user_prefer,username,username,username,username], function (err, res) {
//                 if (err) 
//                     reject(err);
//                 else 
//                 resolve(res);
//             })
//         })
// };

// exports.getUsers = function (username,user_prefer,user_latitude,user_longitude) {
//     return new Promise((resolve, reject) => {
//             sql.query("select distinct user_name, TIMESTAMPDIFF(YEAR, user_birthdate, CURDATE()) AS age,ST_Distance_Sphere(point(?,?), point(users.latitude, users.longitude))  as 'distance' from users,images where users.user_id = images.user_id and image_type like 'profil' and user_bio is not null  and user_gender is not null and user_prefer is not null and user_gender REGEXP ? and user_name not in (select liked_user from likes where liker_user like ?) and user_name not in (select blocker_user from blocks where blocked_user like ? ) and user_name not in (select blocked_user from blocks where blocker_user like ?)  and user_name not like ? group by user_name having distance <= 80000 order by distance asc,age asc", [user_latitude,user_longitude,user_prefer,username,username,username,username], function (err, res) {
//                 if (err) 
//                     reject(err);
//                 else 
//                 resolve(res);
//             })
//         })
// };

exports.getUsersYouLike = function (username) {
        return new Promise((resolve, reject) => {
                sql.query("select distinct liked_user from likes where liker_user like ? and not exists (select * from matches where (matcher like liked_user and matched like ?) or (matched like liked_user and matcher like ?))",[username,username,username], (err, res) => {
            if (err) 
                reject(err);
            else 
                resolve(res);
        })
        })
    };

    exports.getUsersLikeYou = function (username) {
        return new Promise((resolve, reject) => {
                sql.query("select distinct liker_user from likes where liked_user like ? and not exists (select * from matches where (matcher like liker_user and matched like ?) or (matched like liker_user and matcher like ?))",[username,username,username], (err, res) => {
            if (err) 
                reject(err);
            else 
                resolve(res);
        })
        })
    };

exports.getUserTags = function (user_id) {
    return new Promise((resolve, reject) => {
        sql.query("Select tags.tags_id,tags.text from tags,user_tags where user_tags.tags_id = tags.tags_id and user_tags.user_id=?", [user_id], function (err, res) {
            if (err)
                reject(err);
            resolve(res);
        });
    })
};

exports.getUserImages = function (user_id) {
    return new Promise((resolve, reject) => {
        sql.query("Select concat(?,image_path) as 'url',image_id,image_type,image_path from images where user_id=? order by image_type desc", ["http://"+host+":3000", user_id], function (err, res) {
            if (err)
                reject(err);
            resolve(res);
        });
    })
}


exports.user_profile = function (username) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT user_id,user_name, user_fullname, TIMESTAMPDIFF(YEAR, user_birthdate, CURDATE()) AS user_age, user_gender, user_bio, user_prefer, user_popularity, user_addresse,longitude,latitude,user_mail FROM `users` WHERE user_name = ?", username, function (err, res) {
            if (err)
                reject(err);
            resolve(res);
        })
    })
}

exports.getProfilInfo = function (username) {
    return new Promise((resolve, reject) => {
        sql.query("select concat(? ,image_path) as 'imgurl',TIMESTAMPDIFF(YEAR, user_birthdate, CURDATE()) AS user_age,user_name,users.user_id,user_bio,longitude,latitude,user_popularity,user_prefer,user_addresse,user_gender,user_fullname from images,users where image_type like 'PROFIL' and images.user_id=users.user_id and user_name like ?", ["http://"+host+":3000",username], function (err, info) {
        if (err) 
            reject(err);
        else
            resolve(info);
    })
    })
}