const express = require('express');
const userRoute = express.Router();
const mongoose = require('mongoose');

let UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


userRoute.post('/signup',(req, res, next)=>{
    bcrypt.hash(req.body.password, 10,(err, hash)=>{
        if(err){
            return res.status(500).json({
                error: err
            })
        } else {
            const user = new UserModel({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                password: hash,
                email: req.body.email
            })
            user.save()
            .then(result => {
                res.status(200).json({
                    newUser:result
                })
            })
            .catch(err =>{
                res.status(500).json({
                    error: err
                })
            })
        }
    })
})


userRoute.post('/login', (req, res, next) =>{
    UserModel.find({username: req.body.username})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({message: 'User not exist'})
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
            if(!result){
                return res.status(401).json({message: 'Password not matched'})
            }
            if(result){
                const token = jwt.sign({
                    username: user[0].username,
                    email: user[0].email
                },
                'dummy token',
                {
                    expiresIn: "24h"
                }
                );
                res.status(200).json({
                    username: user[0].username,
                    email: user[0].email,
                    token:token
                })
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            err: err
        })
    })
})

module.exports = userRoute;