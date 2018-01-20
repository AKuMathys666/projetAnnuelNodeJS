module.exports = (server) => {
    server.controllers = {
        users: require('./users')(server),
        tasks: require('./tasks')(server),
        auth: require('./auth')(server),
        teams: require('./teams')(server),
        projects: require('./projects')(server),
        roles: require('./roles')(server)
    };
};