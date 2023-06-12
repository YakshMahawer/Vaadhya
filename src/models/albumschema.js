const mongoose = require("mongoose");
const validator  = require("validator");

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    src: {
        type:String,
        required: true
    },
    year: {
        type:Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    songs_id: {
        type: Array,
        required: true
    },
    trends: {
        type:Number,
        default: 0
    },
    curAlbViews: {
        type: Array, 
        required: false
    },
    prevAlbViews: {
        type: Array, 
        required: false
    }
});

const Album = new mongoose.model('Album',albumSchema);
module.exports = Album;
