const router = require('express').Router();

module.exports = (api) => {
    router.get('/:id',
        api.middlewares.ensureAuthentificated,
        api.actions.fishes.findById);

    router.get('/',
        api.middlewares.ensureAuthentificated,
        api.actions.fishes.getAll);

    router.post('/',
        api.middlewares.ensureAuthentificated,
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Fishes'),
        api.actions.fishes.create);

    router.put('/:id',
        api.middlewares.ensureAuthentificated,
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Fishes'),
        api.actions.fishes.update);

    router.delete('/:id',
        api.middlewares.ensureAuthentificated,
        api.middlewares.cache.clean('Fishes'),
        api.actions.fishes.remove);
    return router;
};