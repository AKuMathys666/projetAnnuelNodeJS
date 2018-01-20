const router = require('express').Router();
const bodyParser = require('body-parser');

module.exports = (server) => {
    router.get('/',
        server.middlewares.ensureAuthenticated,
        server.controllers.tasks.list);

    router.post('/:idProject',
        server.middlewares.ensureAuthenticated,
        server.middlewares.bodyParser.json(),
        server.middlewares.ensureBodyFields(['title', 'startDate']),
        server.controllers.tasks.create);

    router.delete('/:id',
        server.middlewares.ensureAuthenticated,
        server.controllers.tasks.remove);

    router.put('/:id',
        server.middlewares.ensureAuthenticated,
        server.middlewares.bodyParser.json(),
        server.controllers.tasks.update);
/*
    router.post('/assign/:id',
        server.middlewares.ensureAuthenticated,
        server.middlewares.bodyParser.json(),
        server.controllers.tasks.assign);*/
/*
    router.post('/assign-project/:id',
        server.middlewares.ensureAuthenticated,
        server.middlewares.bodyParser.json(),
        server.controllers.tasks.signProject);*/
    return router;



};