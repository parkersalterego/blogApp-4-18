const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 13;
const STAMP_ROUNDS = 8;

class UserController {
    constructor(router) {
        router.route('/users')
            .get(this.getAllUsers);
        router.route('/users/login')
            .options(UserController.allowCredentials)
            .post(UserController.allowCredentials, this.loginUser);
        router.route('/users/register')
            .post(this.registerUser);
        router.route('/users/:_id')
            .get(this.getUserById)
            .delete(this.deleteUser);
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.find({'is_deleted' : false});
            res.json(users);
        } catch(err) {
            next(err);
        }
    }

    async loginUser(req, res, next) {
        try {
            const user = await User.findOne({'email' : req.body.email, 'is_deleted' : false});
            res.json(user);
        } catch(err) {
            next(err);
        }
    }

    static allowCredentials(req, res, next) {
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    }

    async registerUser(req, res, next) {
        try {
            const checkEmail = await User.findOne({'email' : req.body.email, 'is_deleted' : false})
            if (checkEmail !== null) {
                const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
                res.status(403).json({'Error' : 'An account already exists with the provided email or username'});
            } else {
                const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
                const stampData = JSON.stringify( {email: req.body.email, password: hash});
                const secStamp =  await bcrypt.hash(stampData, STAMP_ROUNDS);
                const user = await {
                    userName: req.body.userName,
                    email: req.body.email,
                    password: hash,
                    secStamp: secStamp
                };
                const newUser = await User.create(new User(user))
                    res.status(200).json(newUser);
            }
        } catch(err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await User.findOne({'_id' : req.params._id, 'is_deleted' : false});
                res.status(200).json(user);
        } catch(err) {
            next(err);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const softDelete = await User.findOneAndUpdate(req.params._id, {'is_deleted' : true}, {'new' : true})
            res.status(200).json(softDelete);
        } catch(err) {
            next(err)
        }
        
    }

}

module.exports = UserController;
