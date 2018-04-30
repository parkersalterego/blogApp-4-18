const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    secStamp: String,
    is_deleted: {
        type: Boolean,
        default: false
    }
});

UserSchema.path('email').validate((email) => {
    let emailRegex = /^([\w-]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'The Email Field Cannot Be Empty');

const User = module.exports = mongoose.model('User', UserSchema);
