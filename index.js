const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const morganMiddleware = require("./midlewares/morganMiddleware");
const logger = require("./utils/logger");
const app = express();
const { WebSocketServer } = require("ws") ;




//databse connection
require('./configs/db')();

//databse connection
// require('./configs/db')();

//routers list
const farmerRouter =require('./routers/farmerRouter');
const authRouter = require('./routers/authRouter')
const buyerRouter =require('./routers/buyerRouter')
const productRouter =require('./routers/productRouter')
const orderRouter = require('./routers/orderRouter')
const biddingRouter = require('./routers/biddingRouter')


app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morganMiddleware);
app.use(bodyParser.json());
app.use(express.json());

app.post('/',(req,res)=>{
    console.log("Nuwan")
    res.send("hii")
})
app.use('/api/farmer',farmerRouter)
//end point starting for the auth routes
app.use('/api/signin',authRouter)
//end point starting for the buyer routes
app.use('/api/buyer',buyerRouter)
//end point starting for the product routes
app.use('/api/product',productRouter)
//end point starting for the order routes
app.use('/api/order',orderRouter);




app.use('/api/bidding',biddingRouter)


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));