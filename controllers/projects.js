module.exports = (server) => {
    const Project = server.models.Project;
    const User = server.models.User;
    const Team = server.models.Team;
    const Role = server.models.Role;

    return {
        list,
        create,
        remove,
        update
    };

    function list(req, res) {
        Project.find()
            .then(projects => res.send(projects))
    }

    function create(req, res) {
        const userId = req.token.userId;
        let project = new Project(req.body);

        project.creator = userId;
        createATeam(project);

        project.save()
            .then(project => res.status(201).send(project))
            .catch(err => res.status(500).send(err));

        function createATeam(project) {
            let team = new Team();
            team.project = project._id;
            team.members.push(userId);
            project.equipe = team._id;
            assignRole(team);
            return team.save();

            function assignRole(team) {
                return Role.find()
                    .sort('-level')
                    .then(roles => roles[2])
                    .then(role => {
                        team.roleNumbers.push(role);
                        return team.save();
                    });
            }
        }
    }

    function remove(req, res) {
        findProject(req)
            .then(ensureExist)
            .then(ensureCreator)
            .then(removeTeam)
            .then(remove)
            .then(() => res.status(204).send())
            .catch(err => res.status(err.code || 500).send(err.reason || err));

        function remove() {
            return Project.findByIdAndRemove(req.params.id);
        }
        function removeTeam(project) {
            return Team.findByIdAndRemove(project.equipe.toString());
        }
        function ensureCreator(project) {
            return project.creator.toString() === req.token.userId ? project : Promise.reject({code: 403, reason: 'not.allowed'});
        }
    }

    function update(req, res) {
        findProject(req)
            .then(ensureExist)
            .then(ensureCreator)
            .then(update)
            .then(() => res.status(204).send())
            .catch(err => res.status(err.code || 500).send(err.reason || err));

        function update() {
            return Project.findByIdAndUpdate(req.params.id, req.body)
        }
        function ensureCreator(project) {
            return project.creator.toString() === req.token.userId ? project : Promise.reject({code: 403, reason: 'not.allowed'});
        }
    }

    // Globals
    function findProject(req) {
        return Project.findById(req.params.id)
    }

    function ensureExist(data) {
        return data ? data : Promise.reject({code: 422, reason: 'unprocessable.entities'});
    }
};