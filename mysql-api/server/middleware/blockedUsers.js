const Profile = require('../models/profilemodel');

exports.blockMidllware = (req, res, next) => {
    username = req.jwt.user;
    try{
    Profile.getBolcks(username, (err, sqlres) => {
        if (err)
            res.end();
        else {
            if (sqlres[0]) {
                var arr = {
                    blocked: [],
                    blockedme: []
                };
                sqlres.forEach(element => {
                    if (element.blocked_user !== username) {
                        arr.blockedme.push(element.blocked_user);
                    }
                    else if (element.blocker_user !== username) {
                        arr.blocked.push(element.blocker_user);
                    }
                });
                req.blocked = arr;
                next();
            } else
                next();
        }
    });
} catch (err) { }
}