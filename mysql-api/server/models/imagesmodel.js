const sql = require('../db/db');
var jimp = require('jimp');
const uuidv1 = require('uuid/v1');
const destination = __dirname + "/../../uploads/";

exports.getUserImages = function (user_id, result) {
    sql.query("Select concat(?,image_path) as 'url',image_id,image_type,image_path from images where user_id=?", ["http://" + host + ":3000", user_id], function (err, res) {
        if (err) {
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};



function createNewImage(image_name, image_type, user_id) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO `images` set image_type = ?, image_path = ? , user_id = ?",
            [image_type, "/uploads/" + image_name, user_id], function (err, res) {
                if (err) {
                    //console.log("error SQL: ", err);
                    reject(err);
                }
                else {
                    //console.log(res.insertId);
                    resolve({ image_id: res.insertId, image_path: "/uploads/" + image_name, image_type: image_type, url: "http://" + host + ":3000/uploads/" + image_name });
                }
            });
    }
    )
}

exports.createImage = function (Image, user_id, result) {
    return new Promise((resolve, reject) => {
        var img = String(Image["image"]).split(/data:image\/(?:png|jpeg|bmp|jpg);base64,/);
        const base64str = String(img[1]);
        var image_name = uuidv1() + ".jpeg";
        var image_path = destination + image_name;
        var image_type = Image["type"];
        const buf = Buffer.from(base64str, 'base64');
        jimp.read(buf, (err, image) => {
            if (err) reject('invalid image');
            else {
                image.write(image_path);
                createNewImage(image_name, image_type, user_id).then(
                    res => {
                        //console.log(res);
                        resolve(res);
                    },
                    err => { reject(err) }
                )
            }
        })
    })
};

exports.deleteUserImage = function (user_id, image_id, result) {
    sql.query("delete from images where user_id = ? and image_id = ?", [user_id, image_id], (err, res) => {
        if (!err) {
        }
        result(null, res);
    })
};

exports.countimages = function (user_id, image_type) {
    return new Promise((resolve, reject) => {
        sql.query("select count(image_id) as 'imgcount' from images where user_id = ? and image_type = ?",
            [user_id, image_type], function (err, res) {
                if (err) {
                    //console.log("error SQL: ", err);
                    reject(err);
                }
                else {
                    resolve(res[0].imgcount);
                }
            });
    }
    )
}