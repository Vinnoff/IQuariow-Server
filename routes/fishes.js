const router = require('express').Router();

module.exports = (api) => {
    router.get('/:id',
        api.actions.fishes.findById);

    router.post('/',
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Fishes'),
        api.actions.fishes.create);

    router.put('/:id',
        api.middlewares.bodyParser.json(),
        api.middlewares.cache.clean('Fishes'),
        api.actions.fishes.update);

    router.delete('/:id',
        api.middlewares.cache.clean('Fishes'),
        api.actions.fishes.remove);
    return router;
}
