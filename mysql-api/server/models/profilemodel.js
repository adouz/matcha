const sql = require('../db/db');

function isAlreadyLiked(likeruser, likeduser) {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM likes WHERE liker_user = ? AND liked_user = ?', [likeruser, likeduser], (err, res) => {
            if (err) {
                //console.log(err);
                reject(err);
            }
            resolve(res);
        });
    });
}

exports.liked = (likeruser, likeduser, result) => {
    //check if already liked
    isAlreadyLiked(likeruser, likeduser).then(
        (res) => {
            if (res.length === 0)
                sql.query('INSERT INTO likes (liker_user, liked_user, time) VALUES(?,?, NOW())', [likeruser, likeduser], (err, res) => {
                    //console.log('new like');
                    if (err) {
                        //console.log(err);
                        result(err, null);
                    }
                    sql.query('UPDATE users SET user_popularity = user_popularity + 4 WHERE user_name = ?', [likeduser]);
                    //console.log(res);
                    result(null, res);
                });
            else {
                //console.log('already liked');
                result(null, 'already liked');
            }
        },
        (err) => { /*console.log(err)*/ }
    );
}

exports.LikedUsers = (username, result) => {
    sql.query('SELECT liked_user FROM likes WHERE liker_user = ?', [username], (err, res) => {
        if (err) {
            //console.log(err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

function isLikedBack(likeduser, likeruser) {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM likes WHERE liker_user = ? AND liked_user = ?', [likeduser, likeruser], (err, res) => {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}

exports.isMatch = (likeduser, likeruser, result) => {
    // check if user if liked back first
    isLikedBack(likeduser, likeruser).then(
        res => {
            //its a match if user liked back
            if (res.length !== 0) {
                //console.log('its a match');
                sql.query('INSERT INTO `matches` ( `matcher`, `matched`, `room`, `time`)VALUES(?, ?, UUID(), NOW())', [likeduser, likeruser], (err, res) => {
                    if (err)
                        result(err, null);
                    else {
                        result(null, res);
                    }
                });
            } else {
                //console.log('is not a match');
                result(null, 'is not a match');
            }
        },
    err => { /*console.log(err)*/ }
    )
}

function DeleteRoomAndMessages(unlikeruser, unlikeduser) {
    return new Promise((resolve, reject) => {
        sql.query('DELETE FROM matches WHERE (matcher like ? AND matched like ?) OR (matcher like ? AND matched like ?)', [unlikeruser, unlikeduser, unlikeduser, unlikeruser], (err, res) => {
            if (err)
                reject(err)
            else
                sql.query('DELETE FROM messages WHERE (`from` like ? AND `to` like ?) OR (`from` like ? AND `to` like ?)', [unlikeruser, unlikeduser, unlikeduser, unlikeruser]);
            resolve(res)
        });

    });
}

exports.unliked = (unlikeruser, unlikeduser, result) => {
    sql.query('DELETE FROM likes WHERE liker_user = ? AND liked_user = ?', [unlikeruser, unlikeduser], (err, res) => {
        if (err) {
            //console.log(err);
            result(err, null);
        } else {
            //console.log('unliked:: ', res);
            sql.query('UPDATE users SET user_popularity = user_popularity - 4 WHERE user_name = ?', [unlikeduser]);
            if (res.affectedRows) {
                //console.log('delete room and messages');
                DeleteRoomAndMessages(unlikeruser, unlikeduser).then(
                    res => {
                        result(null, res)
                    },
                    err => {
                        //console.log(err)
                    }
                );
            } else
                result(null, res);
        }
    });
}

function isBlocked(blockeRuser, blockeDuser) {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM `blocks` WHERE blocker_user = ? AND blocked_user = ?', [blockeRuser, blockeDuser], (err, res) => {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}

function DeleteAll(blocker, blocked) {
    sql.query('DELETE FROM matches WHERE (matcher like ? AND matched like ?) OR (matcher like ? AND matched like ?)', [blocker, blocked, blocked, blocker]);
    sql.query('DELETE FROM messages WHERE (`from` like ? AND `to` like ?) OR (`from` like ? AND `to` like ?)', [blocker, blocked, blocked, blocker]);
    sql.query('DELETE FROM likes WHERE (`liker_user` like ? AND `liked_user` like ?) OR (`liker_user` like ? AND `liked_user` like ?)', [blocker, blocked, blocked, blocker]);
}

exports.block = (blockeRuser, blockeDuser, result) => {
    isBlocked(blockeRuser, blockeDuser).then(
        resp => {
            //console.log(resp[0], "bla zero", resp);
            if (resp.length === 0) {
                sql.query('INSERT INTO `blocks` (blocker_user, blocked_user, time) VALUES(?,?,NOW())', [blockeRuser, blockeDuser], (err, res) => {
                    if (err) {
                        //console.log(err);
                        result(err, null);
                    } else {
                        DeleteAll(blockeRuser, blockeDuser);
                        result(null, res);
                    }
                });
            } else
                result(null, 'Already blocked');
        },
        err => {
            result(err, null);
        }
    )
}

exports.getBolcks = (username, result) => {
    sql.query('SELECT * FROM `blocks` WHERE blocker_user = ? OR blocked_user = ?', [username, username], (err, res) => {
        if (err) {
            //console.log(err);
            result(err, null);
        }
        result(null, res);
    });
}

exports.blockedUsers = (username, result) => {
    sql.query('SELECT `blocks`.*, `users`.`user_id`, `users`.`user_fullname`,TIMESTAMPDIFF(YEAR, users.user_birthdate, CURDATE()) AS user_age,TIMESTAMPDIFF(DAY, blocks.time, CURDATE()) AS block_days, concat(?,`images`.image_path) AS image FROM `blocks`, `users`, `images` WHERE blocker_user = ? AND `user_name` = blocked_user AND `users`.`user_id` = `images`.`user_id` AND image_type = "PROFIL" order by timestamp(time) desc', ["http://" + host + ":3000", username], (err, res) => {
        if (err) {
            //console.log(err);
            result(err, null);
        }
        result(null, res);
    });
}

exports.report = (ReporteRuser, ReportDuser, result) => {
    sql.query('INSERT INTO `reports` (`reporter`, `reported`,`time`) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE time = NOW()', [ReporteRuser, ReportDuser], (err, res) => {
        if (err) {
            //console.log(err);
            result(err, null);
        }
        result(null, res);
    });
}

exports.unblock = (username, unblocked, result) => {
    sql.query('DELETE FROM `blocks` WHERE blocker_user = ? AND blocked_user = ?', [username, unblocked], (err, res) => {
        if (err) {
            //console.log(err);
            result(err, null);
        }
        result(null, res);
    });
}