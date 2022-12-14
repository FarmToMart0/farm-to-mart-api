const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morganMiddleware = require("./midlewares/morganMiddleware");
const app = express();




//routers list
const farmerRouter = require("./routers/farmerRouter");
const authRouter = require("./routers/authRouter");
const buyerRouter = require("./routers/buyerRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const biddingRouter = require("./routers/biddingRouter");
const gsoRouter = require("./routers/gsoOfficerRouter");
const mainOfficerRouter = require("./routers/mainOfficerRouter");
const reviewRouter = require("./routers/reviewRouter");

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morganMiddleware);
app.use(bodyParser.json());
app.use(express.json());


//end point starting for the farmer routes
app.use("/api/farmer", farmerRouter);

//end point starting for the auth routes
app.use("/api/signin", authRouter);
//end point starting for the buyer routes
app.use("/api/buyer", buyerRouter);
//end point starting for the product routes
app.use("/api/product", productRouter);
//end point starting for the review routes
app.use("/api/reviews", reviewRouter);
//end point starting for the order routes

app.use("/api/order", orderRouter);
app.use("/api/bidding", biddingRouter);

app.use("/api/gso", gsoRouter);
app.use("/api/main-officer", mainOfficerRouter);


module.exports = app