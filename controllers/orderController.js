const express = require('express');
const mongoose = require('mongoose');
const {Order,validateOrder} =require('../models/OrderModel/index');
const _ = require('lodash');
const logger = require("../utils/logger");
const generateOutput= require('../utils/outputFactory');

async function getPlaceOrders(req,res) {
    
}