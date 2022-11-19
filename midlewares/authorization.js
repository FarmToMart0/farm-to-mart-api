const jwt = require("jsonwebtoken");
require('dotenv').config();
const generateOutput = require("../utils/outputFactory");
const logger = require("../utils/logger");

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(200).send(generateOutput(403,'forbiden','user not authorized'));
    jwt.verify(token, process.env.TOKEN_SECRET || 'jwtPrivateKey', (err, user) => {
    if (err) return  res.status(200).send(generateOutput(403,'forbiden',err));
    req.user = user;
    next();
  });
  } catch (error) {
    logger.error(error);
    res.status(200).send(generateOutput(501,'error','server Error in midlware'));
  }
}




module.exports=authenticateToken
