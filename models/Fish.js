const Schema = require('mongoose').Schema;
const timestamps = require('mongoose-timestamps');

module.exports = (api) => {
    const schema = new Schema({
        name: {
            type: String,
            required: true
        },
        Species: {
            type: Schema.Types.ObjectId,
            ref: 'Species',
            required: true
        },
        Aquarium: {
            type: Schema.Types.ObjectId,
            ref: 'Aquarium',
            default: null
        },
        Owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        height: {
            type: Number
        }
    });

    schema.plugin(timestamps);
    return api.mongoose.model('Fish', schema);
};
