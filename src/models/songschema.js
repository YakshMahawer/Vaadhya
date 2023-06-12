const mongoose = require("mongoose");
const validator  = require("validator");

const songSchema = new mongoose.Schema({
    song_name: {
      type:String,
      required: true 
    },
    album_id: {
      type:String,
      required: true 
    },
    album_img: {
      type:String,
      required: true 
    },
    song_src: {
       type: String,
       required: true
    },
    singers: {
      type:String,
      required: true  
    },
    added_on:{
      type: Date,
      default: Date.now
    },
    tags:{
      type: String,
      required: true
    }
});

const Song = new mongoose.model('Song',songSchema);
module.exports = Song;