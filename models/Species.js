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
            type: String,
            required: true
        },
        minVolume:{
            type: Number
        },
        zones:[{
            type: String,
            required: true
        }],
        PHMin:{
            type: Number,
            required: true
        },
        PHMax:{
            type: Number,
            required: true
        },
        tempMin:{
            type: Number,
            required: true
        },
        tempMax:{
            type: Number,
            required: true
        },
        pictures:[{
            type: String
        }],
        diet:{
            type: String,
            required: true
        }
    });

    schema.plugin(timestamps);
    return api.mongoose.model('Species', schema);
};
