const router = require('express').Router();

module.exports = (server) => {

    router.get('/',
        server.controllers.users.list);

    router.get('/:id',
        server.controllers.users.listId);

    router.post('/',
        server.middlewares.bodyParser.json(),
        server.middlewares.ensureBodyFields(['email', 'password']),
        server.controllers.users.create);

    router.delete('/:id',
        server.middlewares.ensureAuthenticated,
        server.controllers.users.remove);

    router.put('/:id',
        server.middlewares.ensureAuthenticated,
        server.middlewares.bodyParser.json(),
        server.controllers.users.update);

    return router;
};