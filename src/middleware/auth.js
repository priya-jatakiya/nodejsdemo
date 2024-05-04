const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');

const auth = async function(req, res, next) {
    try {
        let authToken = req.header('Authorization')
        if (authToken != '' && authToken != undefined) {
            authToken = authToken.replace('Bearer ', '');
            let tokenData = jwt.verify(authToken, process.env.JWT_SECRET);
            if (tokenData == null || !tokenData._id) throw new Error('Trying to access unauthorized resourse.');
            let user = await userModel.findById(tokenData._id)
            if (user == null || !user._id) throw new Error('Authentation failed, please try again.');
            req.user = user;
            next();
        } else {
            throw new Error('Please authenticate.');
        }
    } catch (tokenErr) {
        res.status(400).send(tokenErr.message)
    }
}

module.exports = auth;