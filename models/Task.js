const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = Schema({
    title: {
        type: String,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    project:{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    times:{
        type: Number,
        Required: false,
        default: '0'
    }
});

module.exports = mongoose.model('Task', TaskSchema);