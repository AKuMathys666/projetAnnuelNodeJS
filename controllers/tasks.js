const bodyParser = require('body-parser');

module.exports = (server) => {
    const Task = server.models.Task;
    const User = server.models.User;
    const Project = server.models.Project;

    return {
        list,
        create,
        remove,
        update,
        //assign,
        //signProject,
    };

    function list(req, res) {
        return Task.find()
            .then(tasks => res.send(tasks));
    }

    function create(req, res) {/*
        let task = new Task(req.body);
        findUser(req)
            .then(user => {
                task.owner = req.token.userId;
                user.tasks.push(task);
                user.save()});

        //addToProject(task);
        task.save()
        //.then(addToProject)
            .then(task => res.status(201).send(task))
            .catch(error => res.status(500).send(error));


        function addToProject(task) {
            return Project.findById(req.params.id)
                .then(project => {
                    project.tasks.push(task);
                    task.project = req.params.id;
                    task.save();
                    return project.save();
                })
                .then(project => {return task;});
        }*/
        let project;
        let user;
        let task;
        const userId = req.token.userId;
        return User.findById(userId)
            .then(createTask)
            .then(instance => task = instance)
            .then(addToTask)
            .then(addToUser)
            .then(findProject)
            .then(ensureExist)
            .then(addToProject)
            .then(task => res.status(201).send(task))
            .catch(error => res.status(500).send(error));

        function createTask(data) {
            user = data;
            return new Task(req.body);
        }

        function addToTask(task) {
            task.owner = userId;
            task.project = req.params.idProject;
            return task.save();
        }

        function addToUser(task) {
            user.tasks.push(task.id);
            return user.save();
        }

        function addToProject(data) {
            data.tasks.push(task.id);
            return data.save();
        }

        function ensureExist(data) {
            return data ? data : Promise.reject({code: 422, reason: 'unprocessable.entities'});
        }

        function findProject() {
            return project= Project.findById(req.params.idProject);
        }
    }

    function remove(req, res) {
        return Task.findByIdAndRemove(req.params.id)
            .then(() => res.status(204).send())
    }

    function update(req, res) {
        return Task.findByIdAndUpdate(req.params.id, req.body)
            .then(task => res.status(204).send());
    }
/*
    function assign(req, res) {
        return Task.findById(req.params.id)
        //.then(instance => task = instance)
            .then(task => {
                addToUser(task);
            });

        function addToUser(task) {
            return User.findById(req.body.idUser)
                .then(user => {
                    ensureNotAlreadyTaken(task, user);
                    //user.tasks.push(task);
                    task.owner = user._id;
                    task.save();
                    res.send(task);
                    user.save();
                })
                .then(user => task)
                .catch(err => res.status(err.code || 500).send(err.reason || err));
        }

    }
    */
/*
    function signProject(req,res){
        return Task.findById(req.params.id)
        //.then(instance => task = instance)
            .then(task => {
                addToProject(task);
            });

        function addToProject(task) {
            return Project.findById(req.body.idProject)
                .then(project => {
                    ensureNotAssigned(task, project);
                    //user.tasks.push(task);
                    task.project = project._id;
                    task.save();
                    res.send(task);
                    project.save();
                })
                .then(project => task)
                .catch(err => res.status(err.code || 500).send(err.reason || err));
        }
    }
*/
    function findUser(req) {
        return User.findById(req.token.userId);
    }

    function ensureExist(data) {
        return data ? data : Promise.reject({code: 422, reason: 'unprocessable.entities'});
    }

    function ensureNotAlreadyTaken(task, user) {
        return (task.owner === +user._id) ? Promise.reject({code: 403, reason: 'task.already.taken'}) : task;
        //res.send("y"+task.owner);
        //res.send("x"+user._id);
        //return user;
        //return (task.owner === user._id) ? res.send("same") : res.send("diff");
        //return ("x" + task.owner === "x" + user._id) ? res.send("same") : res.send("diff");
    }
    /*
    function ensureNotAssigned(task, project) {
        return (task.project === +project.id()) ? Promise.reject({code: 403, reason: 'task.already.assigned'}) : task;
    }*/
};