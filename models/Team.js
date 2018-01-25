const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = Schema({
    project:{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    roleNumbers:[{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }],
    members:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Team', TeamSchema);