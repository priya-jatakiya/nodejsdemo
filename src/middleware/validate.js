const { query } = require('express-validator');

const userValidate = async function(req, res, next) {
    try {
        query('email').notEmpty()
        next();
    } catch (validateErr) {
        res.status(400).send(validateErr.message)
    }
}

module.exports = {
    userValidate
};