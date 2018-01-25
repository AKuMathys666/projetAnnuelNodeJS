module.exports = (server) => {
    const Role = server.models.Role;

    return {
        list,
        listId
    };

    function list(req, res) {
        Role.find()
            .then(roles => res.send(roles))
    }

    function listId(req, res) {
        Role.findById(req.params.id)
            .then(users => res.send(users));
    }
};