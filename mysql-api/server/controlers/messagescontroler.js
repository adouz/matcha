const messages = require('../models/messagesmodel');

function validate_username(username) {
    if (!username.match(/^[a-z]+([_-]?[a-z0-9])*$/g))
        return false;
    return true;
}

/*function getProfile(username){
    return new Promise(function(resolve, reject) {
        console.log('lol');
        messages.getProfilImage(username, (err, imgres) => {
            if (err){
                reject(err);
            }
            if(imgres[0]){
                var data = JSON.stringify(imgres[0].imgurl);
                resolve(data);
            }
        });
    });
}*/

exports.matches = async (req, res) => {
    const username = req.params.username.toLowerCase();
    var resarray = [];
    if (validate_username(username)) {
            try{
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
                    try{
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
                        (err) => { console.log(err) }
                    )
                }catch (err) {}
                    console.log('data:', obj);
                    resarray.push(obj);
                }
            },
            (err) => { console.log(err) }
        );
    }catch (err) {}
        return res.json({
            success: true,
            data: resarray
        });
    }

    //    messages.matches(username, (err, sqlres) => {
    //         if (err)
    //             return res.end();
    //         var resarray = [];
    //        sqlres.forEach(async (item, idex) => {
    //             var obj = {};
    //             if (item.matcher !== username) {
    //                 obj.username = item.matcher;
    //             } else {
    //                 obj.username = item.matched;
    //             }
    //             obj.selected = false;
    //             obj.room = item.room;
    //             await messages.getProfilImage(obj.username).then(function (image) {
    //                 if (image[0]) 
    //                     obj.url = JSON.stringify(image[0].imgurl);
    //                 /*else
    //                     obj.url = "https://delitsdopinion.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png";*/
    //             })
    //             // messages.getProfilImage(obj.username, (err, imgres) => {
    //             // if (err)
    //             // return res.end();
    //             // //else    //return imgres.end();
    //             //     if(imgres[0])
    //             //         {obj.url = JSON.stringify(imgres[0].imgurl);
    //             //             console.log('url',obj.url);
    //             //         }
    //             // });
    //             //obj.url = item.url;
    //             console.log(obj);
    //            resarray.push(obj);
    //             console.log("FILL",resarray);
    //         });
    //         console.log("LAST",resarray);
    //         return res.json({
    //             success: true,
    //             data: resarray
    //         });
    //     });
    else {
        return res.json({
            success: false,
            error: 'not a valid user id'
        });
    }
}

exports.addMessage = (data) => {
    try{
    messages.addMessage(data, (err, sqlres) => {
        if (err)
            return;
    });
}catch (err) {}
}

exports.getMessages = (req, res) => {
    const room = req.params.room;
    try {
    messages.getMessages(room, (err, sqlres) => {
        if (err)
            res.end()
        else {
            res.json(sqlres);
        }
    });
}catch (err) {}
}