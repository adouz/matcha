const Filter = require('../models/filtermodel');

exports.checkProfil = (req, res, next) => {
    username = req.jwt.user;
    let data = [];
    try{
    Filter.getProfilInfo(username).then(
        (resUser) => {
            data = resUser[0];
            if(data){
                next();
            }else{
                res.send('Incomplete profile');
            }
            //console.log(data);
        },
        (err) => {
            //console.log(err);
            next(false);        
        }
    )
} catch (err) { }
}