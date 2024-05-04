const {model, Schema} = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new  Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter valid email.');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, {minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1})) {
                throw new Error('Password must be of minimum 8 characters long with at least one capital character, one small character and one symbol.');
            }
        }
    },
    tokens: {
        type: Array,
        default: []
    }
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
      }
});

userSchema.pre('save', {document: true, query: false}, async function(next) {
    try {
        let userData = this;
        if (userData.isModified('password')) userData.password = await bcrypt.hash(userData.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        next();
    } catch (error) {
        throw new Error(error.message);
    }
});

userSchema.statics.generateToken = async function(userData) {
    try {
        let token = jwt.sign({_id: userData._id}, process.env.JWT_SECRET);
        userData.tokens.push({token: token});
        await this.findByIdAndUpdate(userData._id, {tokens: userData.tokens});
        return {userData, token}
    } catch (error) {
        throw new Error(error.message)
    }
}

const userModel = model('users', userSchema);

module.exports = userModel;