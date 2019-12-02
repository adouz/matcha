const sql = require('../db/db');
const crypto = require('crypto');
var Users = function (users) {
    //this.user_id = users.user_id;
    if (users.user_name)
        this.user_name = users.user_name.toLowerCase();
    if (users.user_fullname)
        this.user_fullname = users.user_fullname;
    if (users.user_birthdate)
        this.user_birthdate = users.user_birthdate;
    //this.user_gender = users.user_gender;
    if (users.user_password)
        this.user_password = crypto.createHash('sha256').update(users.user_password).digest('hex');
    if (users.user_mail)
        this.user_mail = users.user_mail;
    if (users.user_fullname)
        this.user_fullname = users.user_fullname;
    if (users.user_gender)
        this.user_gender = users.user_gender;
    if (users.user_prefer)
        this.user_prefer = users.user_prefer;
    if (users.user_bio)
        this.user_bio = users.user_bio;
    if (users.user_addresse)
        this.user_addresse =users.user_addresse;
    if(users.longitude)
        this.longitude = users.longitude;
    if(users.latitude)
        this.latitude = users.latitude;
    this.user_token = crypto.randomBytes(48).toString('hex');
    /*  this.user_hashpwd = 0;//hash
        this.user_status = 0;
        this.mailverfied = 1;*/
};

function checkusername(newUser) {
    return new Promise((resolve, reject) => {
        sql.query('Select * from users where user_name like ?', [newUser.user_name], (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
            resolve(!res.length);
        });
    });
}
function checkusermail(newUser) {
    return new Promise((resolve, reject) => {
        sql.query('Select * from users where user_mail like ?', [newUser.user_mail], (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
            var response = !res.length;
            resolve(response);
        });
    });
}

Users.createUser = function (newUser, result) {
    checkusername(newUser).then(
        (response) => {
            if (response) {
                checkusermail(newUser).then(
                    (response) => {
                        if (response) {
                            console.log(newUser);
                            sql.query("INSERT INTO `users` set ?",
                                newUser, function (err, res) {
                                    if (err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                    }
                                    else {
                                        console.log(res.insertId);
                                        result(null, 'OK');
                                    }
                                })
                        }
                        else
                            result(null, 'mail exist');
                    }, (err) => {
                        result(err, null);
                    }
                )
            }
            else
                result(null, 'username exist');
        },
        (err) => {
            result(err, null);
        }
    )


    // sql.query("Select * from users where user_name like ? or user_mail like ?",
    // [newUser.user_name,newUser.user_mail], function (err, res) {
    //        if(err) {
    //           console.log("error: ", err);
    //            result(err, null);
    //        }
    //        if(!res.length)

    // sql.query("INSERT INTO `users` set ?",
    //     newUser, function (err, res) {
    //         if (err) {
    //             console.log("error: ", err);
    //             result(err, null);
    //         }
    //         else {
    //             console.log(res.insertId);
    //             result(null, 'OK');
    //         }
    //     });
    //     else
    //             result(null, 'Already exist');
    // });
};
Users.getUserById = function (userId, result) {
    sql.query("Select * from users where user_id = ?", [userId], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
Users.getAllUsers = function (result) {
    sql.query("Select * from users", function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('users : ', res);

            result(null, res);
        }
    });
};

function checkFirstIfFieldsAreEmpty(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM users WHERE user_id = ?", [id], (err, res) => {
            if (err)
                reject(err);
            else if (!res[0].longitude && !res[0].latitude){
                resolve(1);
            }else{
                resolve(0);
            }
        });
    });
}

Users.updateLocation = function (id, location, result) {
    checkFirstIfFieldsAreEmpty(id).then(
        res => {
            if (res){
                sql.query("UPDATE users SET ? WHERE user_id = ?", [location, id], function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    else {
                        result(null, res);
                    }
                });
            }
        },
        err => { console.log(err) }
    )
};

Users.updateById = function (id, users, result) {
    sql.query("UPDATE users SET ? WHERE user_id = ?", [users, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

Users.remove = function (id, result) {
    sql.query("DELETE FROM users WHERE user_id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {

            result(null, res);
        }
    });
};


Users.auth = (User, result) => {
    console.log(User);
    sql.query("SELECT * FROM users WHERE user_name = ?", User.toLowerCase(), (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

Users.authID = (Userid, result) => {
    console.log(Userid);
    sql.query("SELECT * FROM users WHERE user_id = ?", Userid, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}


Users.resetpassword = (email, token, result) => {
    sql.query('UPDATE users SET user_passwd_token = ? WHERE user_mail = ?', [token, email], (err, res)=>{
        if (err){
            console.log(err)
            result(err, null);
        }
        result(null, res);
    });
}

Users.verifyRset = (email, token, result) => {
    sql.query('SELECT * FROM users WHERE user_passwd_token = ? AND user_mail = ?', [token, email], (err, res) => {
        if (err){
            console.log(err);
            result(err, null);
        }
        result(null, res);
    });
}

Users.changePassword = (email, token, newpass, result) => {
    sql.query('UPDATE users SET user_password = ? WHERE user_passwd_token = ? AND user_mail = ?', [newpass,token,email], (err ,res) => {
        if (err){
            console.log(err);
            result(err, null);
        }
        if (res.affectedRows)
            sql.query('UPDATE users SET user_passwd_token = NULL WHERE user_mail = ?', [email]);
        result(null, res);
    });
}

Users.Addlastconnection = (username, result) =>{
    sql.query('UPDATE `users`SET `last_connection` = NOW() WHERE `user_name` =  ?', [username], (err, res) => {
        if (err){
            console.log(err);
            result(err, null);
        }
        else
            result(null, res);
    });
}

Users.Getlastconnection = function (username) {
    return new Promise( (resolve, reject) => {
         sql.query('SELECT `last_connection` FROM `users` WHERE `user_name` =  ?', [username], (err, res) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else
                resolve(res)
        });
    });
}

/*
Users.storeToken = (data) => {
    sql.query("INSERT INTO `users_token`(`username`, `token`) VALUES (?,?)", [data.user, data.token], (err, res) => {
        if (err)
            console.log(err);
    });
}

Users.DestroyToken = (token) => {
    sql.query("DELETE FROM `users_token` WHERE `token` = ?", token, (err, res) => {
        console.log(token);
        if (err)
            console.log(err);
    })
}*/
/*Users.auth = function (User, result) {
    sql.query("Select * from users where user_name = ?", [User.user_name], function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
                //console.log('Not Connected Wrong USER');
            }
            else if (res.length === 1)
            {
                var user_id = res[0].user_id;
                var user_name = res[0].user_name;
                var user_password = crypto.createHash('sha256').update(res[0].user_password).digest('hex');
                var user_status = res[0].user_status;
                var user_mail = res[0].user_mail;
                if(User.user_password.match(user_password))
                {
                       console.log('Connected at ',User.longitude, User.latitude);
                        console.log(res[0].user_id);
                        if(user_status)
                        {
                        var location = {longitude : User.longitude,latitude : User.latitude}
                        //verify location 
                        if ((Number(location.longitude) === location.longitude && location.longitude % 1 !== 0)
                        && (Number(location.latitude) === location.latitude && location.latitude % 1 !== 0))
                        //Update user with new location
                        Users.updateById(user_id,location, function(err) {
                            if (err)
                              res.send(err);
                        })
                        //Create Session
                        result(null, 'OK');
                        }
                        else
                        result(null,{err : "mail", msg :"You have to activate your account."});
                }
                else
                    result(null,{err : "password", msg :"The password you entered was not valid."});   
            }
            else
                result(null,{err : "user", msg :"No account found with that username."});
        });   
};*/

module.exports = Users;