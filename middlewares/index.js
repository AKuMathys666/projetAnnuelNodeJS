module.exports = (server) => {
    server.middlewares = {
        bodyParser: require('body-parser'),
        logger: require('./logger'),
        ensureBodyFields: require('./ensureBodyFields'),
        ensureAuthenticated: require('./ensureAuthenticated')(server),
        ensureRights: require('./ensureRights')}
};