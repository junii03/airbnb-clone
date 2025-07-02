const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [40, 'Name should be under 40 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password should be at least 6 characters'],
        select: false,
    },
    picture: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    });

// Encrypt password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

// Validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
    return await bcrypt.compare(userSentPassword, this.password);
};

// Create and return jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
