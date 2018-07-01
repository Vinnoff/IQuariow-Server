module.exports = (api) => {
    api.actions = {
        auth: require('./auth')(api),
        aquariums: require('./aquariums/crud')(api),
        fishes: require('./fishes/crud')(api),
        species: require('./species/crud')(api),
        users: require('./users/crud')(api),
    };
};