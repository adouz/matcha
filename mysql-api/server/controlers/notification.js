var notification = require('../models/notificationmodel');

exports.addNotification = (data) => {
    console.log(data);
    try {
        notification.addNotification(data, (err, ressql) => {
        if (err)
            return;
        console.log(ressql);
    });
}catch (err) {}
}

exports.getNotification = (req, res) => {
    var username = req.params.username.toLowerCase();
    notification.getNotification(username, (err, ressql) => {
        if (err)
            res.end();
        else {
            res.json(ressql);
        }
    });
}
exports.setAllNotification = (req, res) => {
    let username = req.jwt.user;
        notification.setAllNotification(username, (err, sqlres) => {
        if (err)
            res.end();
        else
            res.json(sqlres);

    });
}

exports.newNotification = (req, res) => {
    var username = req.jwt.user;
    notification.newNotification(username, (err, sqlres) => { 
        if (err) {
            res.end();
        }
        res.send(sqlres);
    });
}