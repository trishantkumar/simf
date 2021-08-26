const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
    }
}, {
    collection: 'categories'
})

module.exports = mongoose.model('Category', categorySchema)