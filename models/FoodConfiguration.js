const Schema = require('mongoose').Schema;
const timestamps = require('mongoose-timestamps');

module.exports = (api) => {
    const schema = new Schema({
        hasFood: {
            type: Boolean,
            required: true,
            default: false
        },
        cycle: {
            type: Number,
            required: true
        },
        lastDistribution:[{
            type: String
        }]
    });

    schema.plugin(timestamps);
    return api.mongoose.model('FoodConfiguration', schema);
};
