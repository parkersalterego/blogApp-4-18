const express = require('express');
const User = require('../models/user.model');

class UserController {
    constructor(router) {
        router.route('/users/register')
            .post('this.registerUser');
    }

    async registerUser() {

    }
}

module.exports = UserController;