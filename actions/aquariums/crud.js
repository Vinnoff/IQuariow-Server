module.exports = (api) => {
    const Aquarium = api.models.Aquarium;
    const Fish = api.models.Fish;
    const User = api.models.User;


    let isEmpty = function(obj) {
        return Object.keys(obj).length === 0;
    };

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

    function getAll(req, res){
        Aquarium.find({Owner : req.userId},(err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(204).send("no.aquarium");
            }
            return res.send(data);
        });
    }

    function updateFishes(aquariumId, fishes, res, isDeleting) {
        if(isDeleting){
            fishes.forEach(function (element) {
                Fish.findByIdAndUpdate(
                    element,
                    {$set: {Aquarium: null}},
                    {new: true},
                    (err, data) => {
                        if (err) {
                            return res.status(500).send(err);
                        }

                        if (!data) {
                            return res.status(404).send("fish.not.found");
                        }
                    })
            });
        } else {
            fishes.forEach(function (element) {
                Fish.findByIdAndUpdate(
                    element,
                    {$set: {Aquarium: aquariumId}},
                    {new: true},
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
    }

    function create(req, res) {
        let aquarium = new Aquarium(req.body);
        aquarium.Owner= req.userId;
        aquarium.save((err, aquariumData) => {
            if (err) {
                return res.status(500).send(err);
            }

            if(!isEmpty(aquariumData.Fishes)){
                updateFishes(aquariumData._id, aquariumData.Fishes, res, false);
            }
            User.findByIdAndUpdate(req.userId, {$push: {Aquariums:aquariumData._id}}, (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });
            return res.send(aquariumData);
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
        Aquarium.findByIdAndRemove(req.params.id, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(204).send();
            }
            if(data.Fishes){
                updateFishes(req.params.id, data.Fishes, res, true);
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

        Aquarium.findByIdAndUpdate(req.params.id, {$addToSet:{Fishes: {$each:req.body.Fishes}}}, {new: true}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            if(data == null){
                return res.status(404).send("no.data");
            }
            updateFishes(req.params.id, data.Fishes, res, false);
            return res.send(data);
        });
    }

    function delFishes(req, res) {
        Aquarium.findByIdAndUpdate(req.params.id, {$pullAll:{Fishes: req.body.Fishes}}, {new: true}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            updateFishes(req.params.id, req.body.Fishes, res, true);
            return res.send(data);
        });
    }

    return {
        findById,
        getAll,
        create,
        update,
        remove,
        putFishes,
        delFishes
    };
}
