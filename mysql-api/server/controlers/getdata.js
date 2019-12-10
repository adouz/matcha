var getdatamodel = require('../models/getdatamodel');
var Image = require('../models/imagesmodel');
var Tag = require('../models/tagsmodel');
var Likes = require('../models/profilemodel');

exports.userdata = (req, res) => {
    var username = req.params.username.toLowerCase();
    var blocked = req.blocked;
    if (blocked && blocked.blockedme.includes(username)){
        //console.log(username+' blocked you');
        res.send({msg:'blocked you', user: username});
    }else if (blocked && blocked.blocked.includes(username)){
        //console.log('you blocked '+username);
        res.send({msg:'you blocked', user: username});
    }else{
        if (!username) {
            return res.json({
                success: false,
                error: 'username undefined'
            });
        } else if (!String(username).match(/^[a-z]+([_-]?[a-z0-9])*$/g) || username.length > 50) {
            return res.json({
                success: false,
                error: 'username is wrong'
            });
        }
        try{
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
                    try {
                        Image.getUserImages(sqlres[0].user_id, (err, imgres) => {
                            if (err)
                            return res.end();
                            try{
                                Tag.getUserTags(sqlres[0].user_id, (err, tagres) => {
                                    if (err)
                                    return res.end();
                                    try{
                                        Likes.LikedUsers(username, (err, likesres) => {
                                            if (err)
                                            res.end();
                                            return res.json({
                                                success: true,
                                                data: { user: sqlres[0], images: imgres, tags: tagres, likes: likesres }
                                            });
                                        });
                                    }catch (err) {}
                                });
                            }catch (err) {}
                        })
                    }catch (err) {}
                }
            });
        }catch (err) {}
    }
}