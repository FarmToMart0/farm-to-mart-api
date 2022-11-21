const generateOutput = require("../utils/outputFactory");
const logger = require("../utils/logger");

function buyerMiddleware(req, res, next) { 
    try {
      if (req.user.userRole != 'BUYER') return res.status(200).send(generateOutput(403,'forbiden','user not authorized Buyer'));
    next();
    } catch (error) {
      logger.error(error);
      res.status(200).send(generateOutput(501,'error','server Error in midlware'));
    }
  }

module.exports=buyerMiddleware