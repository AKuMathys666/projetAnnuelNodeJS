module.exports = (server) => {
    const Team = server.models.Team;
    const User = server.models.User;
    const Role = server.models.Role;
    const Project = server.models.Project;

    return {
        list,
        listId,
        update,
        addMember,
        removeMember,
        assignRole
    };

    function list(req, res) {
        Team.find()
            .then(teams => res.send(teams));
    }

    function listId(req, res) {
        Team.findById(req.params.id)
            .then(teams => res.send(teams));
    }

    function update(req, res) {
        Team.findByIdAndUpdate(req.params.id, req.body)
            .then(() => {
                res.status(204).send();
            })
            .catch(err => res.status(500).send(err))
    }

    function addMember(req, res) {
        let team;

        findTeam(req)
            .then(ensureExist)
            .then(instance => team = instance)
            //.then(ensureCreator)
            .then(findUser)
            .then(ensureExist)
            .then(ensureNotAlreadyMember)
            .then(addMember)
            .then(() => res.status(204).send())
            .catch(err => res.status(err.code || 500).send(err.reason || err));

        function findUser() {
            return User.findById(req.params.userId)
        }

        function ensureNotAlreadyMember(user) {
            return team.members.some(member => member === user._id.toString()) ? Promise.reject({code: 403, reason: 'user.already.member'}) : user;
        }

        function ensureCreator(team) {
            return Project.findById(team.project.toString()).creator.toString() === req.token.userId ? team : Promise.reject({code: 403, reason: 'not.allowed'});
        }

        function addMember(user) {
            team.members.push(user);
            return assignRole(team);
        }
        function assignRole(team) {
            return Role.find()
                .sort('-level')
                .then(roles => roles[0])
                .then(role => {
                    team.roleNumbers.push(role);
                    return team.save();
                });
        }

        function findTeam(req) {
            return Team.findById(req.params.id)
        }

        function ensureExist(data) {
            return data ? data : Promise.reject({code: 422, reason: 'unprocessable.entities'});
        }
    }

    function removeMember(req, res) {
        let team;
        findTeam(req)
            .then(ensureExist)
            .then(instance => team = instance)
            .then(findUser)
            .then(ensureExist)
            .then(ensureIsMember)
            .then(removeMember)
            .then(() => res.status(204).send())
            .catch(err => res.status(err.code || 500).send(err.reason || err));

        function findUser() {
            return User.findById(req.params.userId)
        }

        function ensureIsMember(user) {
            return team.members.some(member => member.toString() === user._id.toString()) ? user : Promise.reject({code: 403, reason: 'user.not.member'});
        }

        function removeMember(user) {
            team.members.remove(user);
            return team.save();
        }

        function ensureExist(data) {
            return data ? data : Promise.reject({code: 422, reason: 'unprocessable.entities'});
        }

        function findTeam(req) {
            return Team.findById(req.params.id)
        }
    }

    function assignRole(req, res){
        let team;
        return User.findById(req.params.userId)
            .then(ensureExist)
            .then(assignRole)
            .then(() => res.status(204).send())
            .catch(err => res.status(err.code || 500).send(err.reason || err));

        function assignRole(user){
            user.role=req.params.roleId;
            return user.save();
        }

        function findTeam(req){
            return team.findById(req.params.teamId);
        }

        function ensureExist(data) {
            return data ? data : Promise.reject({code: 422, reason: 'unprocessable.entities'});
        }

        function ensureIsMember(user) {
            return team.members.some(member => member.toString() === user._id.toString()) ? user : Promise.reject({code: 403, reason: 'user.not.member'});
        }
    }
};