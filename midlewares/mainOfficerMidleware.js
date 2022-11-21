const generateOutput = require("../utils/outputFactory");
const logger = require("../utils/logger");

function farmerMidleware(req, res, next) { 
    try {
      if (req.user.userRole != 'MAINOFFICER') return res.status(200).send(generateOutput(403,'forbiden','user not authorized Officer'));
    next();
    } catch (error) {
      logger.error(error);
      res.status(200).send(generateOutput(501,'error','server Error in midlware'));
    }
  }

module.exports=farmerMidleware