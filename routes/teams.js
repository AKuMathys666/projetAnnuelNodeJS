const router = require('express').Router();
const bodyParser = require('body-parser');

module.exports = (server) => {
    router.get('/',
        server.middlewares.ensureAuthenticated,
        server.controllers.teams.list);

    router.get('/:id',
        server.middlewares.ensureAuthenticated,
        server.controllers.teams.listId);
    router.post('/:id/:userId',
        server.middlewares.ensureAuthenticated,
        server.controllers.teams.addMember);

    router.post('/role/:userId/:roleId',
        server.middlewares.ensureAuthenticated,
        server.controllers.teams.assignRole);

    router.delete('/:id/:userId',
        server.middlewares.ensureAuthenticated,
        //server.middlewares.ensureRights(0),
        server.controllers.teams.removeMember);

    router.put('/:id',
        server.middlewares.ensureAuthenticated,
        server.middlewares.bodyParser.json(),
        server.controllers.teams.update);

    return router;
};