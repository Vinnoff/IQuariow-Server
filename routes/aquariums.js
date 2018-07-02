const router = require('express').Router();

module.exports = (api) => {
    router.get('/:id',
        api.middlewares.ensureAuthentificated,
        api.actions.aquariums.findById);

    router.get('/',
        api.middlewares.ensureAuthentificated,
        api.actions.aquariums.getAll);

    router.post('/',
        api.middlewares.ensureAuthentificated,
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.create);

    router.put('/:id',
        api.middlewares.ensureAuthentificated,
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.update);

    router.put('/fishes/:id',
        api.middlewares.ensureAuthentificated,
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.putFishes);

    router.delete('/fishes/:id',
        api.middlewares.ensureAuthentificated,
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.delFishes);

    router.delete('/:id',
        api.middlewares.ensureAuthentificated,
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.remove);
    return router;
};