const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const userController = require('./controllers/UserController.js');
const productController = require('./controllers/ProductController.js');
const orderController = require('./controllers/OrderController.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads/product_img/', express.static('uploads/product_img'));
app.use('/uploads/user_img/', express.static('uploads/user_img'));
app.use('/uploads/payment_slip_img/', express.static('uploads/payment_slip_img'));

app.use('/user', userController);
app.use('/product', productController);
app.use('/order', orderController);

app.listen(3002, () => {
    console.log("Server running on port 3002");
});