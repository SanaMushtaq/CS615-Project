const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate'); 

const ExperimentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tasks: { 
        type: Array,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
});

ExperimentSchema.plugin(mongoosePaginate); 

const Experiment = mongoose.model('Experiment', ExperimentSchema);

module.exports = Experiment;
