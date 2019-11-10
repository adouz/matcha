var getdatamodel = require('../models/getdatamodel');
var Image = require('../models/imagesmodel');
var Tag = require('../models/tagsmodel');
var Likes = require('../models/profilemodel');
var Filter = require('../models/filtermodel');
var _ = require('lodash');
exports.usersFiltred = async (req, res) => {
    var username = req.jwt.user;
    var resarray = [];
    var userdata = [];
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
    getdatamodel.user_profile(username).then(
        (resUser) => {
            userdata.user = resUser;
            Tag.getUserTags(resUser[0].user_id).then(
                (resTags) => {
                    userdata.tags = resTags;
                },
                (err) => {
                    console.log(err);
                }
            )
        },
        (err) => {
            console.log(err);
        }
    );
    await Filter.getUsers(username).then(
        async (res) => {
            for (const item of res) {
                var data = {};
                console.log(item);
                await getdatamodel.user_profile(item.user_name).then(
                    async (resUser) => {
                        data.user = resUser;
                        await Image.getUserImages(resUser[0].user_id).then(
                            async (resImgs) => {
                                data.Images = resImgs;
                                await Tag.getUserTags(resUser[0].user_id).then(
                                    async (resTags) => {
                                        data.tags = resTags;
                                    },
                                    (err) => {
                                        console.log(err);
                                    }
                                );
                            },
                            (err) => {
                                console.log(err);
                            }
                        )
                    },
                    (err) => {
                        console.log(err);
                    }
                )
                resarray.push(data);
            }
        }
    )
    console.log("DATA DEALK", userdata);
    console.log('===========================');
    console.log(resarray);
    console.log('===========================');
    resarray.forEach(arr => {
        console.log(arr.user[0].user_name, "Have", _.intersectionWith(arr.tags, userdata.tags).length, "Commun tags with", userdata.user[0].user_name);
    });
    // return res.json({
    //     success: true,
    //     data: resarray
    // });
    res.end();
}