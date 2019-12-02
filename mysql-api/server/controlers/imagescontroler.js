const Images = require('../models/imagesmodel.js');

function is_valid_image(image) {
    const errors = {};
    if (image) {
        if (!image["image"].split(/data:image\/(?:png|jpeg|bmp|jpg);base64,/)[1].match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/))
            errors.msg = ['Image invalide'];
    }
    else
        errors.error = ['data wrong format'];
    return errors;
};


exports.create_a_image = async (req, res) => {
    var image = req.body;
    var user_id = req.jwt.userid;
    var resarray = [];
    for (const item of image) {
        let errors = is_valid_image(item);
            if (Object.keys(errors).length != 0)
                return res.json(errors);
        try{
                await Images.createImage(item, user_id).then(
            (info) => {
                resarray.push(info);
            },
            (err) => { console.log(err) }
        )
        }catch (err) {}
    }
    return res.json({
        success: true,
        data: resarray
    });
}

exports.deleteImage = function (req, res) {
    var image_id = req.body.image_id;
    try{
        Images.deleteUserImage(req.jwt.userid, image_id, function (err, images) {
        if (err)
            res.send(err);
        res.send(images);
    });
    }catch (err) {}
};

/*exports.list_user_images = function (req, res) {
   try{
    Images.getUserImages(req.jwt.userid, function (err, images) {
        if (err)
            res.send(err);
        res.send(images);
    });
    }catch (err) {}
};*/