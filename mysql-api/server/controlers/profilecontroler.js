const Profile = require('../models/profilemodel');

exports.liked = (req, res) => {
    var likeruser = req.jwt.user;
    var likeduser = req.params.username;
    var blocked = req.blocked;
    if ( blocked && ((blocked.blocked && blocked.blocked.includes(likeduser)) || (blocked.blockedme && blocked.blockedme.includes(likeduser)))){
        res.end('block');
    }else{

        console.log(req.jwt.user, ' liked ', req.params.username);
        try{Profile.liked(likeruser, likeduser, (err, sqlres) => {
            if (err)
            res.end();
            if (sqlres !== 'already liked'){
                try{
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
                }catch (err) {}
            }else{
                res.send(sqlres);
            }
        });
    }catch (err) {}
    console.log(req.jwt.user, ' liked ', req.params.username);
    }
}

exports.unliked = (req, res) => {
    console.log(req.jwt.user, ' unliked ', req.params.username);
    var unlikeruser = req.jwt.user;
    var unlikeduser = req.params.username;
    try{
    Profile.unliked(unlikeruser,unlikeduser, (err, sqlres) => {
        if (err)
            res.end();
        if (sqlres.affectedRows) res.send('unmatched');
        else res.send('unliked');
    });
}catch (err) {}
}

exports.block = (req, res) => {
    var blockeRuser = req.jwt.user;
    var blockeDuser = req.params.username;
    try{
        Profile.block(blockeRuser,blockeDuser, (err, sqlres) => {
        if (err)
            res.end();
        console.log(sqlres);
        res.send(sqlres);
    });
    }catch (err) {}
    console.log(req.jwt.user, ' blocked ', req.params.username);
}

exports.report = (req, res) => {
    var ReporteRuser = req.jwt.user;
    var ReportDuser = req.params.username;
    console.log(req.jwt.user, ' reported ', req.params.username);
    try{
        Profile.report(ReporteRuser, ReportDuser, (err, sqlres) => {
        if (err)
            res.end();
        res.send('reported');
    });
}catch (err) {}
}

exports.blockedUsers = (req, res) => {
    var username = req.jwt.user;
    Profile.blockedUsers(username, (err, sqlres) => {
        if (err)
            res.end();
        var arr = [];
        sqlres.forEach((element, i) => {
            arr[i] = {};
            arr[i].id = element.user_id;
            arr[i].age = element.user_age;
            arr[i].username = element.blocked_user;
            arr[i].name = element.user_fullname;
            arr[i].date = element.time;
            arr[i].block_days = element.block_days;
            arr[i].image = element.image;
        });
        console.log(arr);
        res.send(arr);
    });
}

exports.unblock = (req, res) => {
    var username = req.jwt.user;
    var unblocked = req.params.username;
    Profile.unblock(username, unblocked, (err, sqlres) => {
        if (err)
            res.end();
        res.send(sqlres);
    });
}