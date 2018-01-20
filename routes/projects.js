/**
 * Created by yidon on 06/07/2017.
 */
const express = require('express');

module.exports = (server) => {
    const router = express.Router();

    router.get('/',
        server.controllers.projects.list);

    router.post('/',
        server.middlewares.ensureAuthenticated,
        server.middlewares.bodyParser.json(),
        server.middlewares.ensureBodyFields(['title']),
        server.controllers.projects.create);

    router.put('/:id',
        server.middlewares.ensureAuthenticated,
        server.middlewares.bodyParser.json(),
        server.controllers.projects.update);

    router.delete('/:id',
        server.middlewares.ensureAuthenticated,
        server.controllers.projects.remove);

    return router;
};