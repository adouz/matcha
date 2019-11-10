var getdatamodel = require('../models/getdatamodel');
var Image = require('../models/imagesmodel');
var Tag = require('../models/tagsmodel');
var Likes = require('../models/profilemodel');

exports.userdata = (req, res) => {
    var username = req.params.username.toLowerCase();
    if (!username) {
        return res.json({
            success: false,
            error: 'username undefined'
        });
    } else if (!username.match(/^[a-z0-9_]{2,30}$/g)) {
        return res.json({
            success: false,
            error: 'username is wrong'
        });
    }
    getdatamodel.user_profile(username, (err, sqlres) => {
        if (err) {
            return res.end();
        }
        if (!sqlres[0]) {
            return res.json({
                success: false,
                error: 'user not found!'
            });
        } else {
            Image.getUserImages(sqlres[0].user_id, (err, imgres) => {
                if (err)
                    return res.end();
                Tag.getUserTags(sqlres[0].user_id, (err, tagres) => {
                    if (err)
                        return res.end();
                    //TODO: need user liked users and blocked users
                    Likes.LikedUsers(username, (err, likesres) => {
                        if (err)
                            res.end();
                        return res.json({
                            success: true,
                            data: { user: sqlres[0], images: imgres, tags: tagres, likes: likesres }
                        });
                    });
                });

            })

        }
    });
}