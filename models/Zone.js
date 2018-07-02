const Schema = require('mongoose').Schema;
const timestamps = require('mongoose-timestamps');

module.exports = (api) => {
    const schema = new Schema({
        Species: {
            type: Schema.Types.ObjectId,
            ref: 'Species',
            required: true
        },
    });

    schema.plugin(timestamps);
    return api.mongoose.model('Zone', schema);
};
