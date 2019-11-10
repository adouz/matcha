const Images = require('../models/imagesmodel.js');

function is_valid_image(image) {
    const errors = {};
    if (image) {
        /*Check if valide image*/
        if (!image["image"].split(/data:image\/(?:png|jpeg|bmp|jpg);base64,/)[1].match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/))
            errors.msg = ['Image invalide'];
    }
    else
        errors.error = ['data wrong format'];
    return errors;
};


// exports.create_a_image = function (req, res) {
//     var image = req.body;
//     var user_id = req.params.userId;
//     /*if(!new_user.user_name)
//        res.status(400).send({ error:true, message: 'Please provide User/status' });*/
//     //console.log(req.body);
//     if (user_id)
//         for (img in image) {
//             //Images.clearImages(user_id, image[img], function (err, ressql) {
//             /*if (err)
//             return res.send(err);*/
//             let errors = is_valid_image(image[img]);
//             if (Object.keys(errors).length != 0)
//                 return res.json(errors);
//             Images.createImage(image[img], user_id, function (err, ressql) {
//                 if (err)
//                     res.send(err);
//             });
//             // });
//         }
// };

exports.create_a_image = async (req, res) => {
    var image = req.body;
    var user_id = req.params.userId;
    var resarray = [];
    for (const item of image) {
        var obj = {};
        //obj.username = item.user;
        let errors = is_valid_image(item);
            if (Object.keys(errors).length != 0)
                return res.json(errors);
         await Images.createImage(item, user_id).then(
            (info) => {
               // console.log("INFOOO>>",info)
                // if (info[0]) {
                //     obj.image_id = info[0].image_id;
                //     obj.image_path= info[0].image_path;
                //     obj.image_type= info[0].image_type;
                //     obj.url= info[0].url;
                // }
                resarray.push(info);
            },
            (err) => { console.log(err) }
        )
        //console.log('data:', obj);
    }
     //console.log("FINAAL",resarray);
    return res.json({
        success: true,
        data: resarray
    });
}

exports.deleteImage = function (req, res) {
    var image_id = req.body.image_id;
    console.log("WACH hadi ghada tm7a", image_id);
    Images.deleteUserImage(req.params.userId, image_id, function (err, images) {
        if (err)
            res.send(err);
        res.send(images);
    });
};

exports.list_user_images = function (req, res) {
    Images.getUserImages(req.params.userId, function (err, images) {
        if (err)
            res.send(err);
        res.send(images);
    });
};