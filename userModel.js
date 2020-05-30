var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

    // ts: {
    //     type: Number,
    //     required: true
       

    // },
    // val: {
    //     type: Number,
    //     required: true
    // }

},{strict:false})
    module.exports = mongoose.model('userTable', userSchema);