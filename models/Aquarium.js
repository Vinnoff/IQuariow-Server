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
        realTemp: {
            type: Number,
            default : null
        },
        intentedTemp: {
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
            hasFood: {
                type: Boolean,
                default: false
            },
            cycle: {
                type: Number,
                default: null

            },
            distributions:[{
                type: String
            }]
        },
        isFavorite: {
            type: Boolean,
            default: false
        }
    });

    schema.plugin(timestamps);
    return api.mongoose.model('Aquarium', schema);
};
