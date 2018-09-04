const sha1 = require('sha1');

module.exports = (api) => {
    const Species = api.models.Species;

    function findById(req, res, next) {
        Species.findById(req.params.id)
        .exec((err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!data) {
                return res.status(404).send("species.not.found");
            }
            return res.send(data);
        });
    }

    function getAll(req, res, next) {
        Species.find()
        .exec((err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!data) {
                return res.status(404).send("no.species");
            }
            return res.send(data);
        });
    }

    function create(req, res, next) {
        let species = new Species(req.body);
        Species.findOne({
            scientificName: species.scientificName
        }, (err, found) => {
            if (err) {
                return res.status(500).send(err)
            }
            if (found) {
                return res.status(401).send('species.already.exist')
            }

            species.save((err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(data);
            })
        })
    }

    function update(req, res, next) {
        Species.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (!data) {
                return res.status(404).send("species.not.found");
            }
            return res.send(data);
        });
    }


    return {
        findById,
        getAll,
        create,
        update
    };
}
