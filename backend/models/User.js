const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String
    },
    password:  {
        type: String
    },
    email: {
        type: String
    }
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)