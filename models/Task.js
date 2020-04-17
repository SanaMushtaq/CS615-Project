const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        default: Date.now
    },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
