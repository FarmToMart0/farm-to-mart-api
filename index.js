const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const morganMiddleware = require("./midlewares/morganMiddleware");
const logger = require("./utils/logger");
const app = express();
//databse connection
require('./configs/db')();

//routers list
const farmerRouter =require('./routers/farmerRouter');
const authRouter = require('./routers/authRouter')
const buyerRouter =require('./routers/buyerRouter')
const productRouter =require('./routers/productRouter')

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morganMiddleware);
app.use(bodyParser.json());
app.use(express.json());


app.use('/api/farmer',farmerRouter)
app.use('/api/signin',authRouter)
app.use('/api/buyer',buyerRouter)
app.use('/api/product',productRouter)


const port = process.env.PORT || 9000;
app.listen(port, () => logger.info(`Server is running on port ${port}`));