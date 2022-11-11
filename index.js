const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { WebSocketServer } = require("ws") ;


//databse connection
// require('./configs/db')();

//routers list
const farmerRouter =require('./routers/farmerRouter');
const authRouter = require('./routers/authRouter')
const buyerRouter =require('./routers/buyerRouter')
const biddingRouter = require('./routers/biddingRouter')


app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.post('/',(req,res)=>{
    console.log("Nuwan")
    res.send("hii")
})
app.use('/api/farmer',farmerRouter)
app.use('/api/signin',authRouter)
app.use('/api/buyer',buyerRouter)



app.use('/api/bidding',biddingRouter)


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));