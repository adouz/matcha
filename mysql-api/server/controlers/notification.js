var notification = require('../models/notificationmodel');

exports.addNotification = (data) => {
    //console.log(data);
    try {
        notification.addNotification(data, (err, ressql) => {
            if (err)
                return;
            //console.log(ressql);
        });
    } catch (err) { }
}

exports.getNotification = (req, res) => {
    var username = req.jwt.user;
    try{
    notification.getNotification(username, (err, ressql) => {
        if (err)
            res.end();
        else {
            res.json(ressql);
        }
    });
    } catch (err) { }
}

exports.setAllNotification = (req, res) => {
    let username = req.jwt.user;
    try{
    notification.setAllNotification(username, (err, sqlres) => {
        if (err)
            res.end();
        else
            res.json(sqlres);

    });
    } catch (err) { }
}

exports.newNotification = (req, res) => {
    var username = req.jwt.user;
    try{
    notification.newNotification(username, (err, sqlres) => {
        if (err) {
            res.end();
        }
        res.send(sqlres);
    });
    } catch (err) { }
}