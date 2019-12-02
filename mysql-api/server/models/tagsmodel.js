const sql = require('../db/db');

// const checkTag = async tag => {
//     await sql.query("SELECT text from tags WHERE text = ?", [tag], (err, res) => {
//         if (!err) {
//             if (!res.length) return true;
//             return false;
//         } else {
//             return false;
//         }
//     })
// }
function validate_tag(tag) {
    if (!tag.match(/.*\S.*/))
        return false;
    return true;
}
// const checkUserTag = async (tag, id) => {
//     await sql.query("SELECT * from tags,user_tags WHERE tags.tags_id = user_tags.tags_id and tags.text = ? and user_id = ? ", [tag,id], (err, res) => {
//         if (!err) {
//             if (!res.length) return true;
//             return false;
//         } else {
//             return false;
//         }
//     })
// }

exports.getAllTags = function () {
    return new Promise((resolve, reject) => {
        sql.query("Select * from tags", function (err, info) {
                    if (err)
                        reject(err);
                    else
                        resolve(info);
        })
    })
};

exports.getUserTags = function (user_id, result) {
    sql.query("Select tags.tags_id,tags.text from tags,user_tags where user_tags.tags_id = tags.tags_id and user_tags.user_id=?", [user_id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

// exports.createTag = function (newTag, result) {

//     sql.query("SELECT text from tags WHERE text = ?", [newTag.text], (err, res) => {
//         if (!err) {
//             if (res.length === 0) {
//                 newTag.text = newTag.text;
//                 sql.query("INSERT IGNORE INTO `tags` set ?",
//                     newTag, function (err, res) {
//                         if (err) {
//                             console.log("error: ", err);
//                             result(err, null);
//                         }
//                         else {
//                             console.log(res.insertId);
//                             result(null, 'OK');
//                         }
//                     });
//             }
//         }
//     })
// };

// exports.AssignTag = function (Tag, user_id, result) {
//     sql.query("delete from user_tags where user_id = ?", [user_id], (err, res) => {
//         if (!err) {
//             sql.query("INSERT IGNORE INTO `user_tags` set tags_id = (Select tags_id from tags where text = ?), user_id = ?",
//                 [Tag.text, user_id], function (err, res) {
//                     if (err) {
//                         console.log("error SQL: ", err);
//                         result(err, null);
//                     }
//                     else {
//                         console.log(res.insertId);
//                         result(null, 'OK');
//                     }
//                 });
//         }
//     })
// };

exports.AssignTag = function (Tag, user_id) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT IGNORE INTO `user_tags` set tags_id = (Select tags_id from tags where text = ?), user_id = ?", [Tag.text, user_id], function (err, info) {
                    if (err)
                        reject(err);
                    else
                        resolve(info);
        })
    })
};

exports.createTag = function (newTag) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT IGNORE INTO `tags` set ?", newTag, function (err, info) {
            if (err)
                reject(err);
            else
                resolve(info);
        })
    })
};

exports.deleteTags = function (user_id) {
    return new Promise((resolve, reject) => {
        sql.query("delete from user_tags where user_id = ? ", [user_id], (err, info) => {
            if (err)
                reject(err);
            else
                resolve(info);
        })
    })
};