const { check, validationResult } = require('express-validator');

const userValidate = [
    check('email')
        .trim()
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Invalid email address!')
        .bail(),
    check('password')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Password can not be empty!')
        .bail()
        .isLength({ min: 8 })
        .withMessage('Minimum 8 characters required!')
        .bail()
        .withMessage('Password must be of minimum 8 characters long with at least one capital character, one small character and one symbol.')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];

module.exports = {
    userValidate
};