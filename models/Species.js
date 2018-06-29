const Schema = require('mongoose').Schema;
const timestamps = require('mongoose-timestamps');

module.exports = (api) => {
    const schema = new Schema({
        scientificName: {
            type: String,
            required: true
        },
        commonNames: [{
            type: String
        }],
        rarety:{
            type: String
        },
        Zones:[{
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        }],
        PHMin:{
            type: Number
        },
        PHMax:{
            type: Number
        },
        tempMin:{
            type: Number
        },
        tempMax:{
            type: Number
        },
        pictures:[{
            type: String
        }]
    });

    schema.plugin(timestamps);
    return api.mongoose.model('Species', schema);
};
