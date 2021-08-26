const express = require('express');
const productRoute = express.Router();
const mongoose = require('mongoose');

let ProductModel = require('../models/Product');


//to get data
productRoute.route('/').get((req, res) => {
    ProductModel.find().then(result=>{
        res.status(200).json({
            productData: result
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
})

//get data by id
productRoute.route('/:id').get((req, res) => {
    ProductModel.findById(req.params.id).then(result=>{
        res.status(200).json({
            productData: result
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
})

//create product
productRoute.route('/').post((req, res) => {
        const product = new ProductModel({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            category: req.body.category,
            image: req.body.image,
            price: req.body.price,
            discount: req.body.discount,
            netPrice: req.body.netPrice,
            description: req.body.description
        })
        product.save().then(result=>{
            res.status(200).json({
              newProduct: result
            })
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            })
        })
})

//update post
productRoute.route('/:id').post((req, res) => {
        ProductModel.findByIdAndUpdate({_id:req.params.id}, {
            $set: {
                name: req.body.name,
                category: req.body.category,
                image: req.body.image,
                price: req.body.price,
                discount: req.body.discount,
                netPrice: req.body.netPrice,
                description: req.body.description
            }
        }).then(result => {
            res.status(200).json({
                updated_product: result
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
    })

// delete post

productRoute.route('/:id').delete((req, res) => {

    ProductModel.remove({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: 'Delete Success',
            result: result
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
})

module.exports = productRoute;