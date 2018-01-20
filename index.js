const express = require('express');
const server = express();

require('./config')(server);        console.log('loading config...');
require('./models')(server);        console.log('loading models...');
require('./controllers')(server);   console.log('loading controllers...');
require('./middlewares')(server);   console.log('loading middlewares...');
require('./routes')(server);        console.log('loading routes...');
require('./boot')(server);        console.log('booting...');

console.log('server started on port ', server.config.port);
server.listen(server.config.port);
