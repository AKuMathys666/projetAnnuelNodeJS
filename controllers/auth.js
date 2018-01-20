const sha1 = require('sha1');
const jwt = require('jsonwebtoken');

module.exports = (server) => {
    const User = server.models.User;

    return {
        login
    };

    function login(req, res, next) {
        const email = req.body.email;
        const password = sha1(req.body.password);

        findUser()
            .then(ensureOne)
            .then(createToken)
            .then(send)
            .catch(err => res.status(err.code || 500).send(err.reason || err));


        function findUser() {
            return User.findOne()
                .select('+password')
                .populate('role')
                .where({email: email, password: password})
                .exec()
        }

        function ensureOne(user) {
            return user ? user : Promise.reject({code: 404, reason: 'user.not.found'})
        }

        function createToken(user) {
            const token = {
                userId: user._id.toString(),
                role : user.role
            };

            return new Promise((resolve, reject) => {
                jwt.sign(token, server.config.salt, {expiresIn: 86400}, (err, encryptedToken) => {
                    if (err)
                        return reject(err);

                    resolve(encryptedToken);
                });
            });
        }

        function send(encryptedToken) {
            res.send(encryptedToken);
        }
    }
};