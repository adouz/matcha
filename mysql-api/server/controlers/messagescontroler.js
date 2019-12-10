const messages = require('../models/messagesmodel');

function validate_username(username) {
    if (!String(username).match(/^[a-z]+([_-]?[a-z0-9])*$/g) || username.lenght > 30)
        return false;
    return true;
}

exports.matches = async (req, res) => {
    const username = req.jwt.user;
    var resarray = [];
    if (validate_username(username)) {
        try {
            await messages.matches(username).then(
                async (res) => {
                    for (const item of res) {
                        var obj = {};
                        if (item.matcher !== username) {
                            obj.username = item.matcher;
                        } else {
                            obj.username = item.matched;
                        }
                        obj.selected = false;
                        obj.isOnline = "waiting";
                        obj.room = item.room;
                        try {
                            await messages.getProfilInfo(obj.username).then(
                                (info) => {
                                    if (info[0]) {
                                        obj.url = info[0].imgurl;
                                        obj.bio = info[0].user_bio;
                                        obj.popularity = info[0].user_popularity;
                                        obj.addresse = info[0].user_addresse;
                                        obj.gender = info[0].user_gender;
                                        obj.fullname = info[0].user_fullname;
                                        obj.age = info[0].user_age;
                                    }
                                },
                                (err) => { /*console.log(err)*/ }
                            )
                        } catch (err) { }
                        //console.log('data:', obj);
                        resarray.push(obj);
                    }
                },
                (err) => { /*console.log(err)*/ }
            );
        } catch (err) { }
        return res.json({
            success: true,
            data: resarray
        });
    }
    else {
        return res.json({
            success: false,
            error: 'not a valid user id'
        });
    }
}

exports.addMessage = (data) => {
    try {
        messages.addMessage(data, (err, sqlres) => {
            if (err)
                return;
        });
    } catch (err) { }
}

exports.getMessages = (req, res) => {
    const room = req.params.room;
    const username = req.jwt.user;
    if (String(room).match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/g)) {
        try {
            messages.getMessages(room, username, (err, sqlres) => {
                if (err)
                    res.end()
                else {
                    res.json(sqlres);
                }
            });
        } catch (err) { }
    } else {
        //console.log('invalid room name');
        res.json({ success: false });
    }
}

exports.getRoom = (room) => {
    return new Promise(async (resolve, reject) => {
        if (String(room).match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/g)) {
            await messages.getRoom(room, (err, res) => {
                if (err)
                    reject(err);
                else resolve(res);
            });
        } else reject('incorrect room');
    });
}