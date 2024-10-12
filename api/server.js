const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const userController = require('./controllers/UserController.js');
const productController = require('./controllers/ProductController.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/user', userController);
app.use('/product', productController);

app.listen(3002, () => {
    console.log("Server running on port 3002");
});