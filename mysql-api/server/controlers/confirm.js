var confirmModel = require('../models/confirmmodel');

exports.confirm = (req, res) => {
    email = req.body.email;
    token = req.body.token;
    //TODO: confirm input first
    confirmModel.confirmToken(email, token, (err, sqlres) => {
        if (err){
            res.end("SQL ERROR 1");
        }else{
            if (sqlres.length){
                //TODO: delete Token after confirming!
                confirmModel.update(email, (err, sqlres1) => {
                    if (err){
                        res.end("SQL ERROR 2");
                    }else{
                        if(sqlres1.affectedRows){
                            return res.json({
                                success: true
                            });
                        }else{
                            return res.json({
                                success: false
                            });
                        }
                    }
                });
            }else{
                // token is wrong
                return res.json({
                    success: false
                });
            }
        }
    });
    //res.send('LOL!');
};