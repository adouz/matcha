var getdatamodel = require('../models/getdatamodel');
var Image = require('../models/imagesmodel');
var Tag = require('../models/tagsmodel');
var Likes = require('../models/profilemodel');
var Filter = require('../models/filtermodel');
const messages = require('../models/messagesmodel');
var _ = require('lodash');
const geolib = require('geolib');

exports.usersFiltred = async (req, res) => {
    var username = req.jwt.user;
    var resarray = [];
    var userdata = [];
    if (!username) {
        return res.json({
            success: false,
            error: 'username undefined'
        });
    } else if (!username.match(/^[a-z]+([_-]?[a-z0-9])*$/g)) {
        return res.json({
            success: false,
            error: 'username is wrong'
        });
    }
    try {
        await Filter.user_profile(username).then(
            async (resUser) => {
                userdata.user = resUser;
                await Filter.getUserTags(resUser[0].user_id).then(
                    async (resTags) => {
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
    } catch (err) { console.log("RRRR") }
    try {
        let preference;
        if (userdata.user[0].user_prefer === 'X')
            preference = '[F-M]';
        else
            preference = userdata.user[0].user_prefer;
        await Filter.getUsers(username, preference).then(
            async (res) => {
                for (const item of res) {
                    var data = {};
                    /*console.log(item);*/
                    try {
                        await Filter.getProfilInfo(item.user_name).then(
                            async (resUser) => {
                                data.user = resUser[0];
                                data.user.isOnline = "waiting";
                                data.user.distance = parseInt(geolib.convertDistance(geolib.getDistance({ latitude: resUser[0].latitude, longitude: resUser[0].longitude },
                                    { latitude: userdata.user[0].latitude, longitude: userdata.user[0].longitude }), 'km'))
                                try {
                                    await Filter.getUserImages(resUser[0].user_id).then(
                                        async (resImgs) => {
                                            data.Images = resImgs;
                                            try {
                                                await Filter.getUserTags(resUser[0].user_id).then(
                                                    async (resTags) => {
                                                        data.tags = resTags;
                                                        data.user.communtags = _.intersectionWith(resTags, userdata.tags, _.isEqual).length;
                                                    },
                                                    (err) => {
                                                        //console.log(err);
                                                    }
                                                );
                                            } catch (err) { }
                                        },
                                        (err) => {
                                            // console.log(err);
                                        }
                                    )
                                } catch (err) { }
                            },
                            (err) => {
                                //console.log(err);
                            }
                        )
                    } catch (err) { }
                    resarray.push(data);
                }
            }
        )
    } catch (err) { }
    return res.json({
        success: true,
        data: resarray
    });
}
exports.usersSuggested = async (req, res) => {
    var username = req.jwt.user;
    var resarray = [];
    var userdata = [];
    if (!username) {
        return res.json({
            success: false,
            error: 'username undefined'
        });
    } else if (!username.match(/^[a-z]+([_-]?[a-z0-9])*$/g)) {
        return res.json({
            success: false,
            error: 'username is wrong'
        });
    }
    try {
        await Filter.user_profile(username).then(
            async (resUser) => {
                userdata.user = resUser;
                await Filter.getUserTags(resUser[0].user_id).then(
                    async (resTags) => {
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
    } catch (err) { console.log("RRRR") }
    try {
        let preference;
        if (userdata.user[0].user_prefer === 'X')
            preference = '[F-M]';
        else
            preference = userdata.user[0].user_prefer;
        await Filter.getUsers(username, preference).then(
            async (res) => {
                for (const item of res) {
                    var data = {};
                    /*console.log(item);*/
                    try {
                        await Filter.getProfilInfo(item.user_name).then(
                            async (resUser) => {
                                data.user = resUser[0];
                                data.user.isOnline = "waiting";
                                data.user.distance = parseInt(geolib.convertDistance(geolib.getDistance({ latitude: resUser[0].latitude, longitude: resUser[0].longitude },
                                    { latitude: userdata.user[0].latitude, longitude: userdata.user[0].longitude }), 'km'))
                                try {
                                    await Filter.getUserImages(resUser[0].user_id).then(
                                        async (resImgs) => {
                                            data.Images = resImgs;
                                            try {
                                                await Filter.getUserTags(resUser[0].user_id).then(
                                                    async (resTags) => {
                                                        data.tags = resTags;
                                                        data.user.communtags = _.intersectionWith(resTags, userdata.tags, _.isEqual).length;
                                                    },
                                                    (err) => {
                                                        //console.log(err);
                                                    }
                                                );
                                            } catch (err) { }
                                        },
                                        (err) => {
                                            // console.log(err);
                                        }
                                    )
                                } catch (err) { }
                            },
                            (err) => {
                                //console.log(err);
                            }
                        )
                    } catch (err) { }
                    resarray.push(data);
                }
                resarray = _.filter(resarray,(item) => {
                      let isGood = (userdata.user[0].user_gender === item.user.user_prefer || item.user.user_prefer ==='X');

                    return (isGood);
                    });
                    resarray = _.orderBy(resarray,[function(item) {return item.user.user_popularity;},function(item) {return item.user.communtags;},function(item) {return item.user.distance;}],["desc","asc","asc"]);
            }
        )
    } catch (err) { }
      return res.json({
        success: true,
        data: resarray
    });
}
exports.usersMatched = async (req, res) => {
    var username = req.jwt.user;
    var resarray = [];
    var userdata = [];
    if (!username) {
        return res.json({
            success: false,
            error: 'username undefined'
        });
    } else if (!username.match(/^[a-z]+([_-]?[a-z0-9])*$/g)) {
        return res.json({
            success: false,
            error: 'username is wrong'
        });
    }
    try {
        Filter.user_profile(username).then(
            (resUser) => {
                userdata.user = resUser;
                Filter.getUserTags(resUser[0].user_id).then(
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
    } catch (err) { console.log("RRRR") }
    try {
        await messages.matches(username).then(
            async (res) => {
                for (const item of res) {
                    var data = {};
                    let matched = {};
                    if (item.matcher !== username) {
                        matched = item.matcher;
                    } else {
                        matched = item.matched;
                    }
                    await Filter.getProfilInfo(matched).then(
                        async (resUser) => {
                            console.log(resUser[0]);
                            if(resUser[0]){
                            data.user = resUser[0];
                            data.user.isOnline = "waiting";
                            data.user.distance = parseInt(geolib.convertDistance(geolib.getDistance({ latitude: resUser[0].latitude, longitude: resUser[0].longitude },
                                { latitude: userdata.user[0].latitude, longitude: userdata.user[0].longitude }), 'km'))

                            await Filter.getUserImages(resUser[0].user_id).then(
                                async (resImgs) => {
                                    data.Images = resImgs;

                                    await Filter.getUserTags(resUser[0].user_id).then(
                                        async (resTags) => {
                                            data.tags = resTags;
                                            data.user.communtags = _.intersectionWith(resTags, userdata.tags, _.isEqual).length;
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
                                resarray.push(data);
                            }
                        },
                        (err) => {
                            console.log(err);
                        }
                    )
                    //resarray.push(data);
                }
                console.log(resarray.length);
            }
        )
    } catch (err) { }
    return res.json({
        success: true,
        data: resarray
    });
}

exports.usersLiked = async (req, res) => {
    var username = req.jwt.user;
    var resarray = [];
    var userdata = [];
    if (!username) {
        return res.json({
            success: false,
            error: 'username undefined'
        });
    } else if (!username.match(/^[a-z]+([_-]?[a-z0-9])*$/g)) {
        return res.json({
            success: false,
            error: 'username is wrong'
        });
    }
  
        Filter.user_profile(username).then(
            (resUser) => {
                userdata.user = resUser;
                Filter.getUserTags(resUser[0].user_id).then(
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

    
        await Filter.getUsersYouLike(username).then(
            async (res) => {
                for (const item of res) {
                    var data = {};
                    
                        await Filter.getProfilInfo(item.liked_user).then(
                            async (resUser) => {
                                if(resUser[0]){
                                data.user = resUser[0];
                                data.user.isOnline = "waiting";
                                data.user.distance = parseInt(geolib.convertDistance(geolib.getDistance({ latitude: resUser[0].latitude, longitude: resUser[0].longitude },
                                    { latitude: userdata.user[0].latitude, longitude: userdata.user[0].longitude }), 'km'))
                                
                                    await Filter.getUserImages(resUser[0].user_id).then(
                                        async (resImgs) => {
                                            data.Images = resImgs;
                                         
                                                await Filter.getUserTags(resUser[0].user_id).then(
                                                    async (resTags) => {
                                                        data.tags = resTags;
                                                        data.user.communtags = _.intersectionWith(resTags, userdata.tags, _.isEqual).length;
                                                    },
                                                    (err) => {
                                                        //console.log(err);
                                                    }
                                                );
                                          
                                        },
                                        (err) => {
                                            // console.log(err);
                                        }
                                    )
                               
                                resarray.push(data);
                            }
                            },
                            (err) => {
                                //console.log(err);
                            }
                        )
                  
                    console.log(resarray.length);
                }
            }
        )
    
    return res.json({
        success: true,
        data: resarray
    });
}

exports.usersLikedYou = async (req, res) => {
    var username = req.jwt.user;
    var resarray = [];
    var userdata = [];
    if (!username) {
        return res.json({
            success: false,
            error: 'username undefined'
        });
    } else if (!username.match(/^[a-z]+([_-]?[a-z0-9])*$/g)) {
        return res.json({
            success: false,
            error: 'username is wrong'
        });
    }
    try {
        Filter.user_profile(username).then(
            (resUser) => {
                userdata.user = resUser;
                Filter.getUserTags(resUser[0].user_id).then(
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
    } catch (err) { console.log("RRRR") }
    try {
        await Filter.getUsersLikeYou(username).then(
            async (res) => {
                for (const item of res) {
                    var data = {};
                    console.log(item);
                    try {
                        await Filter.getProfilInfo(item.liker_user).then(
                            async (resUser) => {
                                if(resUser[0]){
                                data.user = resUser[0];
                                data.user.isOnline = "waiting";
                                data.user.distance = parseInt(geolib.convertDistance(geolib.getDistance({ latitude: resUser[0].latitude, longitude: resUser[0].longitude },
                                    { latitude: userdata.user[0].latitude, longitude: userdata.user[0].longitude }), 'km'))
                                try {
                                    await Filter.getUserImages(resUser[0].user_id).then(
                                        async (resImgs) => {
                                            data.Images = resImgs;
                                            try {
                                                await Filter.getUserTags(resUser[0].user_id).then(
                                                    async (resTags) => {
                                                        data.tags = resTags;
                                                        data.user.communtags = _.intersectionWith(resTags, userdata.tags, _.isEqual).length;
                                                    },
                                                    (err) => {
                                                        //console.log(err);
                                                    }
                                                );
                                            } catch (err) { }
                                        },
                                        (err) => {
                                            // console.log(err);
                                        }
                                    )
                                } catch (err) { }
                                resarray.push(data);
                            }
                            },
                            (err) => {
                                //console.log(err);
                            }
                        )
                    } catch (err) { }
                    //resarray.push(data);
                }
            }
        )
    } catch (err) { }
    return res.json({
        success: true,
        data: resarray
    });
}

// exports.usersFiltred = async (req, res) => {
//     var username = req.jwt.user;
//     var resarray = [];
//     var userdata = [];
//     if (!username) {
//         return res.json({
//             success: false,
//             error: 'username undefined'
//         });
//     } else if (!username.match(/^[a-z0-9_]{2,30}$/g)) {
//         return res.json({
//             success: false,
//             error: 'username is wrong'
//         });
//     }
//     Filter.user_profile(username).then(
//         (resUser) => {
//             userdata.user = resUser;
//             Filter.getUserTags(resUser[0].user_id).then(
//                 (resTags) => {
//                     userdata.tags = resTags;
//                 },
//                 (err) => {
//                     console.log(err);
//                 }
//             )
//         },
//         (err) => {
//             console.log(err);
//         }
//     );
//     await Filter.getUsers(username).then(
//         async (res) => {
//             for (const item of res) {
//                 var data = {};
//                 /*console.log(item);*/
//                 await Filter.user_profile(item.user_name).then(
//                     async (resUser) => {
//                         data.user = resUser;
//                         await Filter.getUserImages(resUser[0].user_id).then(
//                             async (resImgs) => {
//                                 data.Images = resImgs;
//                                 await Filter.getUserTags(resUser[0].user_id).then(
//                                     async (resTags) => {
//                                         data.tags = resTags;
//                                     },
//                                     (err) => {
//                                         console.log(err);
//                                     }
//                                 );
//                             },
//                             (err) => {
//                                 console.log(err);
//                             }
//                         )
//                     },
//                     (err) => {
//                         console.log(err);
//                     }
//                 )
//                 resarray.push(data);
//             }
//         }
//     )
//     return res.json({
//         success: true,
//         data: resarray
//     });
//     //res.end();
// }