const router = require('express').Router();
const userModel = require('../models/user');
const auth = require('../middleware/auth');
const { userValidate } = require('../middleware/validate');
const bcrypt = require('bcrypt');

// Add/Register User
router.post('/api/auth/register',userValidate , async (req, res) => {
    try {
        let user = await (new userModel(req.body)).save();
        if (!user._id) throw new Error('Something went wrong.');
        let userData = await userModel.generateToken(user);
        res.status(201).send(userData);
    } catch(error) {
        res.status(401).send({"error": error.message});
    }
});

// Login User
router.post('/api/auth/login', async (req, res) => {
    try {
        let userData = await userModel.findOne({email: req.body.email});
        if (!userData._id) throw new Error('Something went wrong.');
        let isValidPassword = bcrypt.compare(req.body.email, userData.password);
        if (!isValidPassword) throw new Error('Invalid login credentials.');
        userData = await userModel.generateToken(userData);
        res.status(200).send(userData);
    } catch(error) {
        res.status(400).send({"error": error.message});
    }
});

// Logout User
router.post('/api/auth/logout', auth, async (req, res) => {
    try {
        let headerToken = req.header('Authorization').replace('Bearer ', '');
        let userTokens = req.user.tokens;
        let newTokens = [];
        userTokens.forEach((token) => {
            if (token.token != headerToken) {
                newTokens.push({token: token.token});
            }
        })
        let user = await userModel.findByIdAndUpdate(req.user._id, {tokens: newTokens});
        if (!user._id) throw new Error('Something went wrong.');
        res.status(200).send({"message": "Logout successfully."});
    } catch(error) {
        res.status(400).send({"error": error.message});
    }
});

module.exports = router;