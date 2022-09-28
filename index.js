const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const app = express();
//databse connection
require('./configs/db')();

//routers list
const farmer =require('./routers/farmer');


app.use(express.json());
app.use('/api/farmer',farmer)


const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on port ${port}...`));