const Images = require('../models/imagesmodel.js');

function is_valid_image(image) {
    const errors = {};
    if (image) {
        var split = String(image["image"]).split(/data:image\/(?:png|jpeg|bmp|jpg);base64,/);
        if (split[1])
            if (!String(split[1]).match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/))
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
    var errend = null;
    for (const item of image) {
        let errors = is_valid_image(item);
        if (Object.keys(errors).length != 0)
            return res.json(errors);
        try {
            //console.log(item.type);
            await Images.countimages(user_id, item.type).then(
                async (info) => {
                    //console.log(info);
                    if ((item.type === "profil" && info < 1) || (item.type === "other" && info < 4)) {
                        try{
                        await Images.createImage(item, user_id).then(
                            (info) => {
                                resarray.push(info);
                            },
                            (err) => { /*console.log(err),*/ errend = err })
                        } catch (err) { }
                    }  
                },
                (err) => { /*console.log(err),*/ errend = err }
            )

        } catch (err) { }
    }
    if (!errend) {

        return res.json({
            success: true,
            data: resarray
        });
    } else {
        return res.json({
            success: false,
            message: errend
        });

    }
}

exports.deleteImage = function (req, res) {
    var image_id = req.body.image_id;
    if (image_id && (typeof image_id === 'number')) {
        try {
            Images.deleteUserImage(req.jwt.userid, image_id, function (err, images) {
                if (err)
                    res.send(err);
                res.send(images);
            });
        } catch (err) { }
    } else res.json({ success: false });
};