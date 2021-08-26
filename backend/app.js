const express = require('express'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    database = require('./database'),
    fileUpload = require('express-fileupload')
//Connect mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
        console.log("Database connected")
    },
    error => {
        console.log("Database could't be connected to: " + error)
    })

const products = require('../backend/routes/product.route')
const categories = require('../backend/routes/category.route')
const users = require('../backend/routes/user.route')

const app = express()
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}))


//API
app.use('/product', products)
app.use('/category', categories)
app.use('/user', users)

//create port
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Connected to port ' + port)
})

//error handler
app.use(function(err, req, res) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});