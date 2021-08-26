const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
    },
    category: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: String
    },
    discount: {
        type: String
    },
    netPrice: {
        type: String
    },
    description: {
        type: String
    }
}, {
    collection: 'products'
})

module.exports = mongoose.model('Product', productSchema)