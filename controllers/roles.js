module.exports = (server) => {
    const Role = server.models.Role;

    return {
        list
    };

    function list(req, res) {
        Role.find()
            .then(roles => res.send(roles))
    }
};