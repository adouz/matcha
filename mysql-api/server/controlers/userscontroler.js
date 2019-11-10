const Users = require('../models/usersmodel.js');
const moment = require('moment');
var nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
/** 
STMP Configuration 
**/
var stmp = nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user: "42matcha1337",
    pass: "@42matcha1337@"
  }
});

function send_mail(mail, link) {
  mailOptions={
    to: mail,
    subject: "Matcha | Confirm Your E-mail",
    html: "Please click link below to verify your E-mail:</br><a href=\""+link+"\">Click Here</a><br>Or Open this link on your browser:<br>"+link
  }
  stmp.sendMail(mailOptions, (err, res) => {
    if(err){
      console.log("stmp.sendMail Error:", err);
      return("error");
    }else{
      return("sent");
    }
  });
}

function is_valid_user(users)
{
  //console.log(users);
  const errors = {};
  if (users.user_name && users.user_fullname && users.user_birthdate /*&&
    users.user_gender*/ && users.user_password && users.user_mail ){
	//user_name check
	if (!users.user_name.match(/^[a-z0-9_]{2,30}$/g))
    errors.user_name = ['Name is required'];
  //fullname check
  if(!users.user_fullname.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g))
    errors.user_fullname = ['Fullname is required'];
  //check birthdate
  var date = new Date(users.user_birthdate);
  if (date.getDate() !== NaN || date.getMonth() !== NaN || date.getFullYear() !== NaN)
  {
    let age = moment().diff(date, 'years');
  if (age < 18)
    errors.user_birthdate = ['You have to be more than 18'];}
//check gender
  /*if(!users.user_gender.match(/^\b[FM]{1}\b/g))
    errors.user_gender = ['You most be a man or a women, surely your not something else'];*/
//check password
if(!users.user_password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g))
    errors.user_password = ['Invalid password'];
//check mail
	if (!users.user_mail.match(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/))
    errors.user_mail = ['Email is not valid.'];
  }
  else
 errors.error = ['missing fields'];
  return errors;
};

function validate_login(data){
  let errors = {};
  if (data.user_name && data.user_password && data.longitude && data.latitude){
    if (!data.user_name.match(/^[a-z0-9_]{2,30}$/g)){
      errors.user_name = 'Username ERROR';
    }
    if (!data.user_password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g)){
      errors.user_password = 'password ERROR';
    }
    if (!(data.longitude >= -180 && data.longitude <= 180) && (Number(data.longitude) === data.longitude && data.longitude % 1 !== 0)){
      errors.longitude = 'longitude ERROR';
    }
    if (!(data.latitude >= -90 && data.latitude <= 90) && (Number(data.latitude) === data.latitude && data.latitude % 1 !== 0)){
      errors.latitude = 'latitude ERROR';
    }
  }else{

    errors.fields = 'ERROR: one of fields is Empty.';
  }
  return errors;
}

function nonull(users)
{
  for (key in users) 
    if (!users[key]) 
      delete users[key];
  return users;
}

exports.list_all_users = function(req, res) {
    Users.getAllUsers(function(err, users) {
    if (err)
      res.send(err);
      console.log('res', users);
    res.send(users);
  });
};

exports.Login = function(req,res)
{
    var user = req.body;
    var errors = validate_login(user);
    if (Object.keys(errors).length != 0){ //check INPUT FIRST
      return res.json({
        success: false,
        errors: errors
      });
    }
    Users.auth(user.user_name,function(err, sqlres) {
      if (err){
        console.log("Users.auth:: SQL ERROR::", err);
        return res.end();
      }else{
        if (sqlres.length){
          var db_password = sqlres[0].user_password;
          var user_id = sqlres[0].user_id;
          var userpassowrd = require('crypto').createHash('sha256').update(user.user_password).digest('hex');
          if (db_password.match(userpassowrd)){
            var db_isverfiy = sqlres[0].mailverfied;
            if (db_isverfiy){
              let payload = { user: user.user_name, userid: user_id };
              let token = jwt.sign(payload, appSecret, {
                expiresIn: "24h"
              });
              var location = {longitude : user.longitude, latitude : user.latitude, user_addresse: user.user_addresse};
              Users.updateLocation(user_id,location, function(err) {
                if (err){
                  console.log("Users.updateLocation:: SQL ERROR::", err); 
                  return res.end();
                }
              })
              return res.json({
                success: true,
                token: token
              });
            }else{
              return res.json({
                success: false,
                error: "email" //Need To Verfiy email
              });
            }
          }else{
            return res.json({
              success: false,
              error: "password" //Password incorrect
            });
          }
        }else{
          return res.json({
            success: false,
            error: "user" //user doesn't exists
          });
        }
      }
    });

};
exports.signup = function(req, res) {
    var new_user = new Users(req.body);
    var errors = is_valid_user(req.body);
    if (Object.keys(errors).length != 0)
      return res.json({
        success: false,
        errors: errors
      });
    else
      Users.createUser(new_user, function(err, users) {
        if (err){
          console.log("Users.createUser:: SQL ERROR::", err);
          return res.end();
        }
        if (users === "mail exist" || users === "username exist"){
          return res.json({
          success: false,
          error: users
          });
        }
        
        //send mail to new user
        var link = "http://localhost:8081/verify?t="+new_user.user_token+"&u="+new_user.user_mail;
        send_mail(new_user.user_mail, link); // sending email to user
        return res.json({
          success: true,
          signup: users
        });
  });
};


exports.read_a_user = function(req, res) {
    Users.getUserById(req.params.userId, function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};

exports.update_a_user = function(req, res) {
  var data =  {};
  var users = new Users(req.body);
  //data = nonull(users);
  console.log(data);
  console.log(users);
  Users.updateById(req.params.userId, users , function(err, users) {
    if (err){
      return res.json({
        success: false
      });
    }
    return res.json({
        success: true
      });
  });
};

/*
exports.logout = (req, res) => {
  var token = req.body.token;
  Users.DestroyToken(token);
  res.send("logout");
}
*/
/*exports.delete_a_user = function(req, res) {
    Users.remove( req.params.userId, function(err, users) {
      if (err)
        res.send(err);
      res.json({ message: 'User successfully deleted' });
    });
  };*/