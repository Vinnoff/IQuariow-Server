module.exports = (api) => {
    api.use(api.middlewares.logger);
    api.use('/auth', require('./auth')(api));
    api.use('/aquariums', require('./aquariums')(api));
    api.use('/fishes', require('./fishes')(api));
    api.use('/species', require('./species')(api));
    api.use('/users', require('./users')(api));
};
