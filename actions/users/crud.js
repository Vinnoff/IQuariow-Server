const sha1 = require('sha1');

module.exports = (api) => {
    const User = api.models.User;

    function findById(req, res, next) {
        User.findById(req.params.id)
            .populate('Aquariums', 'name picture')
            .populate('Fishes', 'name Species')
            .exec((err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!data) {
                    return res.status(404).send("user.not.found");
                }
                return res.send(data);
            });
    }

    function findByUsername(req, res, next) {
        User.findOne({
                username: req.params.username
            })
            .populate('Aquariums', 'name picture')
            .populate('Fishes', 'name Species')
            .exec((err, data) => {
                if (err) {
                    return res.status(500).send();
                }
                if (!data || data.length == 0) {
                    return res.status(404).send("user.not.found");
                }
                return res.send(data);
            })
    }

    function create(req, res, next) {
        let user = new User(req.body);
        User.findOne({
            username: user.username,
            mail: user.mail
        }, (err, found) => {
            if (err) {
                return res.status(500).send(err)
            }
            if (found) {
                return res.status(401).send('account.already.exist')
            }

            if (!req.body.password) {
                return res.status(401).send('no.password')
            }
            user.password = sha1(user.password);

            user.save((err, userData) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(userData);
            })
        })
    }

    function update(req, res, next) {
        if (req.userId != req.params.id) {
            return res.status(401).send('cant.modify.another.user.account');
        }
        if (req.body.password) {
            req.body.password = sha1(req.body.password)
        }
        User.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(404).send("user.not.found");
            }
            return res.send(data);
        });
    }

    function remove(req, res, next) {
        if (req.userId != req.params.id) {
            return res.status(401).send('cant.delete.another.user.account');
        }
        User.findByIdAndRemove(req.params.id, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!data) {
                return res.status(404).send('user.not.found');
            }
            return res.send(data);
        });
    }

    return {
        findById,
        findByUsername,
        create,
        update,
        remove
    };
}
