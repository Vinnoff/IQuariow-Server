module.exports = (api) => {
    const Aquarium = api.models.Aquarium;
    const Fish = api.models.Fish;
    const User = api.models.User;


    let isEmpty = function(obj) {
        return Object.keys(obj).length === 0;
    };

    function findById(req, res) {
        Aquarium.findById(req.params.id)
            .populate({
                path: 'Fishes',
                populate: { path: 'Species' }
            })
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

    function getAll(req, res) {
        Aquarium.find({Owner : req.userId})
            .populate({
                path: 'Fishes',
                populate: { path: 'Species' }
            })
            .exec((err, data) => {
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
        if(aquarium.FoodConfiguration.cycle == null || aquarium.FoodConfiguration.cycle <= 0){
            aquarium.FoodConfiguration.cycle = null;
        }
        if(aquarium.isFavorite){
            Aquarium.findOneAndUpdate({isFavorite : true}, {isFavorite : false}, (err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });
        }
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
        Aquarium.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, data) => {
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
            console.log(data);
            User.findByIdAndUpdate(data.Owner, {$pull:{Aquariums:data._id}}, (err, user) => {
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
        Aquarium.findByIdAndUpdate(req.params.id,
            {
                $addToSet:{Fishes: {$each:req.body.Fishes}},
                $set: {intentedTemp: req.body.intentedTemp}
            }, {new: true}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            if(data == null){
                return res.status(404).send("aquarium.not.found");
            }

            updateFishes(req.params.id, data.Fishes, res, false);
            return res.send(data);
        });
    }

    function delFishes(req, res) {
        Aquarium.findByIdAndUpdate(req.params.id,
            {
                $pullAll:{Fishes: req.body.Fishes},
                $set: {intentedTemp: req.body.intentedTemp}
            }, {new: true}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            updateFishes(req.params.id, req.body.Fishes, res, true);
            return res.send(data);
        });
    }

    function setFoodConfiguration(req, res) {
        if(req.body.cycle  == null || req.body.cycle <= 0){
            req.body.cycle = null;
        }
        Aquarium.findByIdAndUpdate(req.params.id, {$set:{FoodConfiguration: req.body}}, {new: true}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.send(data);
        });
    }

    function giveFood(req, res) {
        Aquarium.findById(req.params.id, (err, data) =>{
            if(data == null){
                return res.status(404).send("aquarium.not.found");
            }
        });
        Aquarium.findByIdAndUpdate(req.params.id,{$addToSet: {"FoodConfiguration.distributions":req.body.distribution}}, {new: true}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (err)
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
        delFishes,
        setFoodConfiguration,
        giveFood
    };
};
