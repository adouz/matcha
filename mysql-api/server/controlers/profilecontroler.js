const Profile = require('../models/profilemodel');

exports.liked = (req, res) => {
    var likeruser = req.jwt.user;
    var likeduser = req.params.username;
    Profile.liked(likeruser, likeduser, (err, sqlres) => {
        if (err)
        res.end();
        if (sqlres !== 'already liked'){
            Profile.isMatch(likeduser, likeruser, (err, sqlres1) => {
                if (err)
                res.end();
                else{
                    if (sqlres1 !== 'is not a match'){
                        res.send('its a match');
                    }else
                    res.send(sqlres1);
                }
            });
        }else{
            res.send(sqlres);
        }
    });
    console.log(req.jwt.user, ' liked ', req.params.username);
}

exports.unliked = (req, res) => {
    console.log(req.jwt.user, ' unliked ', req.params.username);
    var unlikeruser = req.jwt.user;
    var unlikeduser = req.params.username;
    Profile.unliked(unlikeruser,unlikeduser, (err, sqlres) => {
        if (err)
            res.end();
        console.log(sqlres);
        res.send('unliked');
    });
}

exports.block = (req, res) => {
    var blockeRuser = req.jwt.user;
    var blockeDuser = req.params.username;
    Profile.block(blockeRuser,blockeDuser, (err, sqlres) => {
        if (err)
            res.end();
        console.log(sqlres);
        res.send(sqlres);
    });
    console.log(req.jwt.user, ' blocked ', req.params.username);
}

exports.report = (req, res) => {
    console.log(req.jwt.user, ' reported ', req.params.username);
    res.end();
}
