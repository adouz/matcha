const express = require('express');
const router = express.Router();
const session = require('express-session');
const path = require('path');
//var signup = require('./public/signup');

router.use(express.urlencoded({ extended: true }))

// initiale session
router.use(
    session({
        secret: "sefdfsdf",
        resave: true,
        saveUninitialized: true
    })
);

// midlleware
/*
    router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})*/

// define the home page route
router.get('/', function (req, res) {
    // welcome page if user is not logged in!
    //res.sendFile(path.join(__dirname+'/../views/welcome.html'));
    res.render('welcome.ejs', {yourdata: 'Matcha'});
});

// define the about route
router.get('/about', function (req, res) {
    res.send('About birds')
});

// singup page
router.get('/singup', function (req, res) {
    res.render('singup.ejs');
});

router.post('/singup', (req, res) => {
    const {fname, lname, username, birthday, email, password} = req.body;
    let errors = [];

    // Check required fields
    if (!fname || !lname || !username || !birthday || !email || !password ){
        errors.push({ msg: 'Please fill in all fields' });
    }

    // check password
    if (password.length < 8){
        errors.push({ msg: 'password should be at least 8 characters' });
    }
    else if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/, "i")){
        errors.push({ msg: 'your password is not strong enough (1 alphabetical , 1 numeric )' });
    }

    // check email
    if (!email.match(/\S+@\S+\.\S+/, "i")){
        errors.push({ msg: 'your email is not a valid one' });
    }

    // check fname && lname
    if (!fname.match(/^[-a-zA-Z]+$/, "i")){
        errors.push({ msg: 'your first name is not valid' });        
    }
    if (!lname.match(/^[-a-zA-Z]+$/, "i")){
        errors.push({ msg: 'your last name is not valid' });        
    }

    // check username
    if (!username.match(/^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$/, "i")){
        errors.push({ msg: 'your username is not valid (ex: us9r_nam9)' });
    }else{
        
        const res = db.query("SELECT COUNT * FROM users WHERE username = ?", [ username ]);
        console.log(res[0]);
    }
    // check birthday
    if (getage(birthday) < 18){
        errors.push({ msg: 'you have to be more than 18 years-old' });
    }

    if (errors.length > 0){
        // render singup page && show errors
        res.render('singup.ejs', {errors: errors,fname: fname,lname: lname,user: username,day: birthday,mail: email});
    }else{
        /*
        db.query("INSERT INTO users (fname, lname, username, birthday, email, password) VALUES (?, ?, ?, ?, ?, ?)", 
        [
            fname,
            lname,
            username,
            birthday,
            email,
            password
        ],
        (err, res) => {
            if (err){
                throw err;
            }
            console.log('excuted');
        }
        );
        */
        console.log(req.body)
    }
  });

router.get('/login', function (req, res) {
    res.render('login.ejs');
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    let errors = [];
    if (!username || !password){
        errors.push({ msg: 'Please fill in all fields' });
    }
    if (!username.match(/^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$/, "i")){
        errors.push({ msg: 'Username is incorrect' });
    }

    if (errors.length > 0){
        res.render('login.ejs', {errors: errors, user: username});
    }else{
        console.log(req.body)
    }
    res.end()
  });

// function to validte age
function getage(date){
    var MILLISECONDS_IN_A_YEAR = 1000*60*60*24*365;
    var array = date.split('-')
    return ((new Date() - new Date(array[0], array[1], array[2]))/MILLISECONDS_IN_A_YEAR);
}

  module.exports = router;
  