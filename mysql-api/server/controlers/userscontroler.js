const Users = require('../models/usersmodel.js');
const moment = require('moment');
var nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
/** 
STMP Configuration 
**/
var stmp = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "42matcha1337",
    pass: "@42matcha1337@"
  }
});

function send_mail(mail, sbj, msg) {
  mailOptions = {
    to: mail,
    subject: sbj,
    html: msg
  }
  try{
  stmp.sendMail(mailOptions, (err, res) => {
    if (err) {
      //console.log("stmp.sendMail Error:", err);
      return ("error");
    } else {
      return ("sent");
    }
  });
  } catch (err) { }
}

function is_valid_user(users) {
  ////console.log(users);
  const errors = {};
  if (users.user_name && users.user_fullname && users.user_birthdate /*&&
    users.user_gender*/ && users.user_password && users.user_mail) {
    //user_name check
    if (!String(users.user_name).match(/^[a-z]+([_-]?[a-z0-9])*$/g) || users.user_name.length > 30 || users.user_name.length < 3)
      errors.user_name = ['Name is required'];
    //fullname check
    if (!String(users.user_fullname).match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g) || users.user_fullname.length > 30)
      errors.user_fullname = ['Fullname is required'];
    //check birthdate
    var date = new Date(users.user_birthdate);
    if (date instanceof Date && !isNaN(date)) {
      if (date.getDate() !== NaN || date.getMonth() !== NaN || date.getFullYear() !== NaN) {
        let age = moment().diff(date, 'years');
        if (age < 18)
          errors.user_birthdate = ['You have to be more than 18'];
      } else errors.user_birthdate = ['user_birthdate ERROR'];
    } else errors.user_birthdate = ['user_birthdate ERROR'];
    //check password
    if (!String(users.user_password).match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g) || users.user_password.length > 30)
      errors.user_password = ['Invalid password'];
    //check mail
    if (!String(users.user_mail).match(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/) || users.user_mail.length > 50)
      errors.user_mail = ['Email is not valid.'];
  }
  else
    errors.error = ['missing fields'];
  return errors;
};

function is_validForUpdate(users) {
  ////console.log(users);
  const errors = {};
  if (users.user_prefer && users.user_fullname && users.longitude && users.latitude && users.user_bio && users.user_addresse &&
    users.user_gender) {
    //fullname check
    if (!String(users.user_fullname).match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g) || users.user_fullname.length > 30)
      errors.user_fullname = ['Fullname is required'];
    //check birthdate
    var date = new Date(users.user_birthdate);
    if (date instanceof Date && !isNaN(date)) {
      if (date.getDate() !== NaN || date.getMonth() !== NaN || date.getFullYear() !== NaN) {
        let age = moment().diff(date, 'years');
        if (age < 18)
          errors.user_birthdate = ['You have to be more than 18'];
      } else errors.user_birthdate = ['user_birthdate ERROR'];
    } else errors.user_birthdate = ['user_birthdate ERROR'];
    //check gender
    if (!String(users.user_gender).match(/^\b[FM]{1}\b/g))
      errors.user_gender = ['You most be a man or a women, surely your not something else'];
    //check user prefer
    if (!String(users.user_prefer).match(/^\b[FMX]{1}\b/g))
      errors.user_prefer = ['You most be a man or a women, surely your not something else'];
    //check password
    if (!String(users.user_bio).match(/.*\S.*/) || users.user_bio.length > 300)
      errors.user_bio = ['Invalid bio'];
    if (!String(users.user_addresse).match(/.*\S.*/) || users.user_addresse.length > 100)
      errors.user_addresse = ['Invalid addresse'];
    // check location
    if (typeof users.longitude === "number" && typeof users.latitude === "number") {
      if (!(users.longitude >= -180 && users.longitude <= 180))
        errors.longitude = 'longitude ERROR 1';
      // if (Number(users.longitude) === users.longitude && users.longitude % 1 !== 0)
      //   errors.longitude = 'longitude ERROR 2';
      if (!(users.latitude >= -90 && users.latitude <= 90))
        errors.latitude = 'latitude ERROR 1';
      // if (Number(users.latitude) === users.latitude && users.latitude % 1 !== 0)
      //   errors.latitude = 'latitude ERROR 2';
    } else errors.latitude = 'latitude ERROR', errors.longitude = 'longitude ERROR';
  }
  else
    errors.error = ['missing fields'];
  return errors;
};


function validate_login(data) {
  let errors = {};
  if (data.user_name && data.user_password && data.longitude && data.latitude) {
    if (!String(data.user_name).match(/^[a-z]+([_-]?[a-z0-9])*$/g) || data.user_name.length > 30 || data.user_name.length < 3) {
      errors.user_name = 'Username ERROR';
    }
    if (!String(data.user_password).match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g) || data.user_password.length > 30) {
      errors.user_password = 'password ERROR';
    }
    // check location
    //console.log(typeof data.longitude, typeof data.latitude === "number");
    if (typeof data.longitude === "number" && typeof data.latitude === "number") {
      if (!(data.longitude >= -180 && data.longitude <= 180))
        errors.longitude = 'longitude ERROR 1';
      // if (Number(data.longitude) === data.longitude && data.longitude % 1 !== 0)
      //   errors.longitude = 'longitude ERROR 2';
      if (!(data.latitude >= -90 && data.latitude <= 90))
        errors.latitude = 'latitude ERROR 1';
      // if (Number(data.latitude) === data.latitude && data.latitude % 1 !== 0)
      //   errors.latitude = 'latitude ERROR 2';
    } else errors.latitude = 'latitude ERROR', errors.longitude = 'longitude ERROR';
  } else {
    errors.fields = 'ERROR: one of fields is Empty.';
  }
  return errors;
}

function validate_update(data) {
  let errors = {};
  if (data.user_name && data.user_oldpassword && data.user_mail) {
    if (!String(data.user_name).match(/^[a-z]+([_-]?[a-z0-9])*$/g) || data.user_name.length > 30 || data.user_name.length < 3) {
      errors.user_name = 'Username ERROR';
    }
    if (!String(data.user_oldpassword).match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g) || data.user_oldpassword.length > 30) {
      errors.user_oldpassword = 'old password ERROR';
    }
    if (!String(data.user_mail).match(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/) || data.user_mail.length > 50) {
      errors.user_mail = 'Email is not valid.';
    }
    if (data.user_password) {
      if (!String(data.user_password).match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g) || data.user_password.length > 30)
        errors.user_password = 'password ERROR';
    }
  } else
    errors.fields = 'ERROR: one of fields is Empty.';
  return errors;
}

function nonull(users) {
  for (key in users)
    if (!users[key])
      delete users[key];
  return users;
}

exports.list_all_users = function (req, res) {
  try {
    Users.getAllUsers(function (err, users) {
      if (err)
        res.send(err);
      //console.log('res', users);
      res.send(users);
    });
  } catch (err) { }
};

exports.Login = function (req, res) {
  var user = req.body;
  var errors = validate_login(user);
  if (Object.keys(errors).length != 0) { //check INPUT FIRST
    return res.json({
      success: false,
      errors: errors
    });
  }
  try {
    Users.auth(user.user_name, function (err, sqlres) {
      if (err) {
        //console.log("Users.auth:: SQL ERROR::", err);
        return res.end();
      } else {
        if (sqlres.length) {
          var db_password = sqlres[0].user_password;
          var user_id = sqlres[0].user_id;
          var userpassowrd = require('crypto').createHash('sha256').update(user.user_password).digest('hex');
          if (String(db_password).match(userpassowrd)) {
            var db_isverfiy = sqlres[0].mailverfied;
            if (db_isverfiy) {
              let payload = { user: user.user_name, userid: user_id };
              let token = jwt.sign(payload, appSecret, {
                // expiresIn: "25min"
              });
              var location = { longitude: user.longitude, latitude: user.latitude, user_addresse: user.user_addresse };
              try {
                Users.updateLocation(user_id, location, function (err) {
                  if (err) {
                    //console.log("Users.updateLocation:: SQL ERROR::", err);
                    return res.end();
                  }
                });
              } catch (err) { }
              return res.json({
                success: true,
                token: token
              });
            } else {
              return res.json({
                success: false,
                error: "email" //Need To Verfiy email
              });
            }
          } else {
            return res.json({
              success: false,
              error: "password" //Password incorrect
            });
          }
        } else {
          return res.json({
            success: false,
            error: "user" //user doesn't exists
          });
        }
      }
    });
  } catch (err) { }
};
exports.signup = function (req, res) {
  var new_user = new Users(req.body);
  var errors = is_valid_user(req.body);
  if (Object.keys(errors).length != 0)
    return res.json({
      success: false,
      errors: errors
    });
  else
    try {
      Users.createUser(new_user, function (err, users) {
        if (err) {
          //console.log("Users.createUser:: SQL ERROR::", err);
          return res.end();
        }
        if (users === "mail exist" || users === "username exist") {
          return res.json({
            success: false,
            error: users
          });
        }

        //send mail to new user
        var link = "http://" + host + ":3000/verify?t=" + new_user.user_token + "&u=" + new_user.user_mail;
        var sbj = "Matcha | Confirm Your E-mail";
        var msg = "Please click link below to verify your E-mail:</br><a href=\"" + link + "\">Click Here</a><br>Or Open this link on your browser:<br>" + link;
        send_mail(new_user.user_mail, sbj, msg); // sending email to user
        return res.json({
          success: true,
          signup: users
        });
      });
    } catch (err) { }
};


var usersupdate = function (users) {
  if (users.user_name)
    this.user_name = users.user_name.toLowerCase();
  if (users.user_password)
    this.user_password = require('crypto').createHash('sha256').update(users.user_password).digest('hex');
  if (users.user_mail)
    this.user_mail = users.user_mail;
};

exports.update_account = function (req, res) {
  var userid = req.jwt.userid;
  var username = req.jwt.user;
  var users = new usersupdate(req.body);
  var passwd = req.body.user_oldpassword;
  //console.log("Tried");
  var errors = validate_update(req.body);
  if (Object.keys(errors).length != 0)
    return res.json({
      success: false,
      errors: errors
    });
  else {
    try {
      Users.authID(userid, function (err, sqlres) {
        if (err) {
          //console.log("Users.auth:: SQL ERROR::", err);
          return res.end();
        } else {
          if (sqlres.length) {
            var db_password = sqlres[0].user_password;
            var userpassowrd = require('crypto').createHash('sha256').update(passwd).digest('hex');
            if (String(db_password).match(userpassowrd) && username === sqlres[0].user_name) {
              try {
                Users.auth(users.user_name, (err, sqlres1) => {
                  //console.log('res1');
                  //console.log(sqlres1);
                  if (err)
                    return res.end();
                  else if (sqlres1.length) {
                    //console.log('xe');
                    if (sqlres1[0].user_name !== username) //not his username
                      return res.json({
                        username: username,
                        reason: 'taken username',
                        success: true
                      });
                  }
                  //console.log('ge');
                  try{
                  Users.updateById(userid, users, function (err, sqlres) {
                    //console.log('res');
                    //console.log(sqlres);
                    if (err) {
                      return res.json({
                        success: false
                      });
                    }
                    if (sqlres.affectedRows) {
                      // token
                      let payload = { user: users.user_name, userid: userid };
                      let token = jwt.sign(payload, appSecret, {
                        expiresIn: "25min"
                      });
                      return res.json({
                        username: users.user_name,
                        token: token,
                        success: true
                      });
                    }
                  });
                } catch (err) { }
                });
              } catch (err) { }
            } else {
              return res.json({
                success: false
              });
            }
          }
        }
      })
    } catch (err) { }
  }
};

exports.update_a_user = function (req, res) {
  var users = new Users(req.body);
  var userId = req.jwt.userid;
  //data = nonull(users);
  var errors = is_validForUpdate(req.body);
  //console.log(errors);
  if (Object.keys(errors).length != 0)
    return res.json({
      success: false,
      errors: errors
    });
  else {
    try {
      Users.updateById(userId, users, function (err, sqlres) {
        if (err) {
          return res.json({
            success: false
          });
        }
        //console.log(users);
        //console.log();
        if (sqlres.affectedRows)
          return res.json({
            success: true
          });
        else
          return res.json({
            success: false
          });
      });
    } catch (err) { }
  }
};

exports.reset = (req, res) => {
  var email = req.body.email;
  if (!String(email).match(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/) || email.length > 50) {
    res.end('invalid email');
  } else {
    var token = require('crypto').randomBytes(48).toString('hex');
    var link = "http://" + host + ":3000/reset?t=" + token + "&e=" + email;
    var sbj = "Matcha | Reset your password";
    var msg = "</br><a href=\"" + link + "\">Click Here</a> To Rest your password <br> OR Copy this link to your Browser:<br>" + link;
    try{
    Users.resetpassword(email, token, (err, sqlres) => {
      if (err)
        res.end();
      //console.log(sqlres);
      if (sqlres.affectedRows) {
        //console.log('sending email...');
        send_mail(email, sbj, msg);
        res.send('sent');
      } else {
        res.send('not found');
      }
    });
  } catch (err) { }
  }
}

exports.verifyRset = (req, res) => {
  var email = req.body.email;
  var token = req.body.token;
  if (!String(email).match(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/) || email.length > 50) {
    res.end('invalid email');
  } else if (!String(token).match(/^[a-zA-Z0-9]*$/) || token.length > 300) {
    res.end('invalid token');
  } else {
    try{
    Users.verifyRset(email, token, (err, sqlres) => {
      if (err)
        res.end();
      if (sqlres.length) {
        res.send('valid');
      } else {
        res.send('unvalid');
      }
    });
    } catch (err) { }
  }
}

exports.changePassword = (req, res) => {
  var email = req.body.email;
  var token = req.body.token;
  var password = req.body.password;
  if (!String(email).match(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/) || email.length > 50) {
    res.end('invalid email');
  } else if (!String(token).match(/^[a-zA-Z0-9]*$/) || token.length > 300) {
    res.end('invalid token');
  } else if (!String(password).match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g) || password.length > 30) {
    res.end('invalid password');
  } else {
    var newpass = require('crypto').createHash('sha256').update(password).digest('hex');
    try{
    Users.changePassword(email, token, newpass, (err, sqlres) => {
      if (err)
        res.end();
      if (sqlres.affectedRows)
        res.send('done');
      else
        res.send('error');
    });
    } catch (err) { }
  }
}

exports.Addlastconnection = (username) => {
  try{
  Users.Addlastconnection(username, (err, res) => {
    if (err)
      return;
    return res;
  });
} catch (err) { }
}
exports.Getlastconnection = async (username) => {
  var last;
  try{
  await Users.Getlastconnection(username).then((res) => {
    last = res[0].last_connection;
  },
    (err) => { /*console.log(err)*/ })
  } catch (err) { }
  return last;
}
