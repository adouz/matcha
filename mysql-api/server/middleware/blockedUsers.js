const Profile = require('../models/profilemodel');

exports.blockMidllware = (req, res, next) => {
    username = req.jwt.user;
    Profile.getBolcks(username, (err, sqlres) => {
        if (err)
            res.end();
        else{
            if (sqlres[0]){
                console.log(sqlres[0]);
                res.end();
            }else
                next();
            // req.block = sqlres;
        }
    });
}