const Visite = require('../models/visitehistorymodel');
const messages = require('../models/messagesmodel');
function validate_username(username) {
    if (!username.match(/^[a-z0-9_]{2,30}$/g))
        return false;
    return true;
}

exports.addViste = (req, res) => {
    let data = req.body;
    let username = req.jwt.user;
    console.log(req.jwt);
    if (data.user_visited !== username)
        Visite.addVisite(data.user_visited, username, (err, sqlres) => {
            if (err)
                res.end();
            });
    res.end();
}

// exports.getVisites = async (req, res) => {
//     const username = req.params.username;
//    Visite.getVisites(username, (err, sqlres) => {
//         if (err)
//             res.end()
//         else {
//             res.json(sqlres);
//         }
//     });
// }

exports.getVisitorsInfo = async (req, res) => {
    const username = req.params.username.toLowerCase();
    var resarray = [];
    if (validate_username(username)) {
        await Visite.getVisites(username).then(
            async (res) => {
                for (const item of res) {
                    var obj = {};
                        obj.username = item.user;
                        obj.date = item.date;
                        obj.time = item.time;
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
                    console.log('data:', obj);
                    resarray.push(obj);
                }
            },
            (err) => { console.log(err) }
        );
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
