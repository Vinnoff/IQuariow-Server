const Schema = require('mongoose').Schema;
const timestamps = require('mongoose-timestamps');

module.exports = (api) => {
    const schema = new Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        mail: {
            type: String,
            unique: true,
            sparse: true
        },
        avatar: {
            type: String
        },
        Aquariums: [{
            type: Schema.Types.ObjectId,
            ref: 'Aquarium'
        }],
        Fishes: [{
            type: Schema.Types.ObjectId,
            ref: 'Fish'
        }]
    });

    schema.plugin(timestamps);
    return api.mongoose.model('User', schema);
};
