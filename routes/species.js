const router = require('express').Router();

module.exports = (api) => {
    router.get('/:id',
        api.actions.species.findById);

    router.get('/',
        api.actions.species.getAll);

    router.post('/',
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Species'),
        api.actions.species.create);

    router.put('/:id',
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Species'),
        api.actions.species.update);

    router.delete('/:id',
        api.middlewares.cache.clean('Species'),
        api.actions.species.remove);
    return router;
}
