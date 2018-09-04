const mongoose = require('mongoose');

module.exports = (api) => {

    api.mongoose = mongoose.connect(api.settings.db.url);

    api.models = {
        Aquarium: require('./Aquarium')(api),
        Fish: require('./Fish')(api),
        Species: require('./Species')(api),
        Token: require('./Token')(api),
        User: require('./User')(api)
    };
};
