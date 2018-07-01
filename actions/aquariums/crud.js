const sha1 = require('sha1');

module.exports = (api) => {
    const Aquarium = api.models.Aquarium;
    const Fish = api.models.Fish;
    const User = api.models.User;

    function findById(req, res) {
        Aquarium.findById(req.params.id)
            .populate('Fishes', 'id name Species')
            .exec((err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!data) {
                    return res.status(404).send("aquarium.not.found");
                }
                return res.send(data);
            });
    }

    function updateFishes(aquariumId, fishes, res) {
        fishes.forEach(function (element) {
            Fish.findByIdAndUpdate(
                element,
                {$set: {Aquarium: aquariumId}},
                {new: true},
                null,
                (err, data) => {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    if (!data) {
                        return res.status(404).send("fish.not.found");
                    }
                })
        });
    }

    function create(req, res) {
        let aquarium = new Aquarium(req.body);

        aquarium.save((err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            updateFishes(data._id, data.Fishes, res);
            User.findByIdAndUpdate(req.userId, {$push: {Aquariums:data._id}}, (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }

                if (!user) {
                    return res.status(204).send();
                }
            });
            return res.send(data);
        });
    }


    function update(req, res) {
        Aquarium.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(204).send()
            }

            return res.send(data);
        });
    }

    function remove(req, res) {
        Playlist.findById(req.params.id, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(204).send();
            }
            User.findByIdAndUpdate(data.Owner, {$pull:{Aquarium:data._id}}, (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }

                if (!user) {
                    return res.status(204).send()
                }
                data.remove((err, data) => {
                    if (err) {
                        return res.status(500).send();
                    }

                    return res.send(data);
                });
            })
        });
    }

    function putFishes(req, res) {
        updateFishes(req.params.id, req.body, res);
        Aquarium.findByIdAndUpdate(req.params.id, {$push: {Fishes:req.body}}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.send(data);
        });

    }

    return {
        findById,
        create,
        update,
        remove,
        putFishes
    };
}
