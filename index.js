const app = require("./server");
const logger = require("./utils/logger")
const mongoose = require('mongoose');
require("./configs/db")();


const port = process.env.PORT || 9000;
app.listen(port, () => logger.info(`Server is running on port ${port}`));

