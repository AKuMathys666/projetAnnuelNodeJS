const express = require('express');

module.exports = (server) => {
    const router = express.Router();

    router.get('/',
        server.middlewares.ensureAuthenticated,
        server.controllers.roles.list);

    return router;
};