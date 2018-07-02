module.exports = (api) => {
    const User = api.models.User;
    const Aquarium = api.models.Aquarium;
    const Fish = api.models.Fish;

    let isEmpty = function(obj) {
        return Object.keys(obj).length === 0;
    };

    function findById(req, res, next) {
        Fish.findById(req.params.id)
            .populate('Species')
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

    function getAll(req, res){
        Fish.find({Owner : req.userId})
            .populate('Species')
            .exec((err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }

                if (isEmpty(data)) {
                    return res.status(204).send("no.fishes");
                }
                return res.send(data);
            });
    }

    function updateAquarium(_id, aquariumId, res, isDeleting) {
        if(isDeleting){
            Aquarium.findByIdAndUpdate(
                aquariumId,
                {$pull: {Fishes: _id}},
                {new: true},
                null,
                (err, data) => {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    if (isEmpty(data)) {
                        return res.status(404).send("aquarium.not.found");
                    }
                }
            );
        } else {
            Aquarium.findByIdAndUpdate(
                aquariumId,
                {push: {Fishes: _id}},
                {new: true},
                null,
                (err, data) => {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    if (isEmpty(data)) {
                        return res.status(404).send("aquarium.not.found");
                    }
                }
            );
        }
    }

    function create(req, res, next) {
        let fish = new Fish(req.body);
        if(fish.Species == null){
            return res.status(401).send("species.id.required");
        }
        fish.Owner = req.userId;
        fish.save((err, fishData) => {
            if (err) {
                return res.status(500).send(err);
            }

            if(!fishData.Aquarium){
                updateAquarium(fishData._id, fishData.Aquarium, res, false);
            }
            User.findByIdAndUpdate(req.userId, {$push: {Fishes:fishData._id}}, (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });
            return res.send(fishData);
        });
    }

    function update(req, res) {
        Fish.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
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
        Fish.findByIdAndRemove(req.params.id, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(204).send();
            }
            if(data.Aquarium){
                updateAquarium(req.params.id, data.Aquarium, res, true);
            }
            User.findByIdAndUpdate(data.Owner, {$pull:{Fishes:data._id}}, (err, user) => {
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

    function addToAquarium(req, res) {
        Fish.findByIdAndUpdate(req.params.id, {set: {Aquarium:req.body.Aquarium}}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            updateAquarium(req.params.id, data.Aquarium, res, false);
            return res.send(data);
        });
    }

    function removeFromAquarium(req, res) {
        Fish.findByIdAndUpdate(req.params.id, {pull: {Aquarium:req.body.Aquarium}}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            updateAquarium(req.params.id, req.body.Aquarium, res, true);
            return res.send(data);
        });
    }

    return {
        findById,
        getAll,
        create,
        update,
        remove,
        addToAquarium,
        removeFromAquarium
    };
}
