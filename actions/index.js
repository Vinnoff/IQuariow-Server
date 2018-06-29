module.exports = (api) => {
    api.actions = {
        auth: require('./auth')(api),
        users: require('./users/crud')(api)
    };
};