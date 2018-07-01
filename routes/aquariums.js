const router = require('express').Router();

module.exports = (api) => {
    router.get('/:id',
        api.actions.aquariums.findById);

    router.post('/',
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.create);

    router.put('/:id',
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.update);

    router.put('/fishes/:id',
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.putFishes);

    router.delete('/fishes/:id',
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.delFishes);

    router.delete('/:id',
        api.middlewares.cache.clean('Aquariums'),
        api.actions.aquariums.remove);
    return router;
};