module.exports = (server) => {
    server.middlewares = {
        bodyParser: require('body-parser'),
        logger: require('./logger')
    }
};