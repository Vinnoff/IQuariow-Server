const Schema = require('mongoose').Schema;
const timestamps = require('mongoose-timestamps');

module.exports = (api) => {
    const schema = new Schema({
        name: {
            type: String,
            required: true
        },
        pictures: [{
            type: String
        }],
        temperature: {
            type: Number
        },
        volume: {
            type: Number
        },
        isDirty: {
            type: Boolean,
            default: false
        },
        Fishes:[{
            type: Schema.Types.ObjectId,
            ref: 'Fish'
        }],
        Owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        FoodConfiguration: {
            type: Schema.Types.ObjectId,
            ref: 'FoodConfiguration'
        }
    });

    schema.plugin(timestamps);
    return api.mongoose.model('Aquarium', schema);
};
