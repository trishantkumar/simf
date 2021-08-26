const express = require('express');
const categoryRoute = express.Router();
const mongoose = require('mongoose');

let CategoryModel = require('../models/Category');

//get
categoryRoute.route('/').get((req, res) => {
    CategoryModel.find().then(result=>{
        res.status(200).json({
            categories: result
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
})


//create category
categoryRoute.route('/').post((req, res) => {
    const product = new CategoryModel({
        _id: new mongoose.Types.ObjectId,
        name: req.body.category,
    })
    product.save().then(result=>{
        res.status(200).json({
          newCategory: result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
})

module.exports = categoryRoute;