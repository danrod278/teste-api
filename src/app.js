'use strict';
//1
const app = require('./config/basic');

require('./config/database');
require('./config/cors')(app);
require('./config/middlewares')(app);
require('./config/routes')(app);
require('./config/models');

module.exports = app;
