const sha1 = require('sha1');

module.exports = (api) => {
    const User = api.models.User;
    const Fish = api.models.Fish;

    function findById(req, res, next) {
        Fish.findById(req.params.id)
            .populate('Aquariums', 'id name picture')
            .populate('Fishes', 'id name Species')
            .exec((err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!data) {
                    return res.status(404).send("fish.not.found");
                }
                return res.send(data);
            });
    }

    function create(req, res, next) {
        new Fish(req.body).save((err, fishData) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.send(fishData);
        })
    }

    function update(req, res, next) {
        if (req.userId != req.params.id) {
            return res.status(401).send('cant.modify.another.user.fish');
        }
        Fish.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(404).send("fish.not.found");
            }
            return res.send(data);
        });
    }

    function remove(req, res, next) {
        if (req.userId != req.params.id) {
            return res.status(401).send('cant.delete.another.user.fish');
        }
        Fish.findByIdAndRemove(req.params.id, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!data) {
                return res.status(404).send('fish.not.found');
            }
            return res.send(data);
        });
    }

    return {
        findById,
        create,
        update,
        remove
    };
}
