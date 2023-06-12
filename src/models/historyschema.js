const mongoose = require("mongoose");
const validator  = require("validator");

const historySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    songID: {
        type: String,
        required: true
    },
    songName: {
        type: String,
        required: true
    },
    songSinger: {
        type: String,
        required: true
    },
    songAlbum:{
        type: String,
        required: true
    }
});

const History = new mongoose.model('History', historySchema);
module.exports = History;