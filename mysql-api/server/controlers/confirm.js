var confirmModel = require('../models/confirmmodel');

function validate_input(email, token) {
    //console.log(email, token);
    if (email && token) {
        if (!String(email).match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/gi) || email.length > 50) {
            //console.log('email error');
            return false;
        }
        if (!String(token).match(/[A-Fa-f0-9]{96}/g) || token.length > 96) {
            //console.log('token error');
            return false;
        }
    } else {
        //console.log('email or token missing');
        return false;
    }
    return true;
}

exports.confirm = (req, res) => {
    email = req.body.email;
    token = req.body.token;
    if (!validate_input(email, token)) {
        res.json({
            success: false
        });
    } else {
        try {
            confirmModel.confirmToken(email, token, (err, sqlres) => {
                if (err) {
                    res.end("SQL ERROR 1");
                } else {
                    if (sqlres.length) {
                        try{
                        confirmModel.update(email, (err, sqlres1) => {
                            if (err) {
                                res.end("SQL ERROR 2");
                            } else {
                                if (sqlres1.affectedRows) {
                                    return res.json({
                                        success: true
                                    });
                                } else {
                                    //console.log('no row affected');
                                    return res.json({
                                        success: false
                                    });
                                }
                            }
                        });
                        }catch (err) { }
                    } else {
                        // token is wrong
                        //console.log('token is wrong');
                        return res.json({
                            success: false
                        });
                    }
                }
            });
        } catch (err) { }
    }
};