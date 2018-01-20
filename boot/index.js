module.exports = (server) => {
    const Role = server.models.Role;
    const User = server.models.User;

    loadRoles()
        .then(createDefaultUser)
        .catch(() => {});

    function loadRoles() {
        const roles = server.config.roles;
        const promises = [];

        roles.forEach(role => {
            let promise = ensureRoleNotExist()
                .then(create)
                .catch(()=> {});

            function ensureRoleNotExist() {
                return Role.findOne({title: role.title})
                    .then(title => title? Promise.reject() : title)
            }

            function create() {
                return Role.create(role);
            }

            promises.push(promise);
        });

        return Promise.all(promises);
    }

    function createDefaultUser() {
        let default_user = server.config.default_user;

        return User.find()
            .then(users => users.length === 0 ? users : Promise.reject())
            .then(create)
            .catch(() => {});

        function create() {
            return User.create(default_user)
                .then(addRole);

            function addRole(user) {
                return findHighestRole()
                    .then(assign);


                function findHighestRole() {
                    return Role.find()
                        .sort('level')
                        .then(levels => levels[0])
                }

                function assign(role) {
                    user.role = role;
                    return user.save();
                }
            }
        }
    }
};