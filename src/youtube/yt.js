// Update
const MongoClient = require("mongodb").MongoClient;
const axios = require("axios").default;
var url = "mongodb://localhost:27017/";
var yt_url = "https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=";
var key = "&key=AIzaSyDwUGeRKMTCeslgQjETBgP1ozqlB0yX9s0";
var final_url;
var curViewCount;
var prevViewCount;

//TO SAVE PAST VIEW DATA FROM CURALBVIEWS TO PREVALBVIEWS
MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("vaadhya");
   dbo.collection("albums").find({}).toArray(function(err, result) {
      if (err) throw err;
      for(var k = 0; k < result.length; k++){
         var getAlbName = result[k].name;
         var prevViewArray = result[k].curAlbViews;
         var myquery = { name: getAlbName};
         var newvalues = { $set: { prevAlbViews: prevViewArray }};
         dbo.collection("albums").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("Saved Last Views");
         });
      }
    });
});

//TO FREE CURALBVIEWS ARRAY TO LET LATEST VIEWS COME THERE
MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("vaadhya");
   var newvalues = { $set: { curAlbViews: [] }};
   dbo.collection("albums").updateMany({}, newvalues, function(err, res) {
    if (err) throw err;
    console.log("Refreashed Database");
  });
});

//Calling the albums API
axios.get('http://localhost:8000/albums/').then(res=>{
   const album_data = res.data;
   for(var i = 0;i<album_data.length;i++){
     for(var j = 0;j<album_data[i].songs_id.length;j++){
       getYTData(album_data[i].songs_id[j],album_data[i].name);
     }
   }
});
 
//Getting the ViewCount
function getYTData(songId,AlbName){
   MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("vaadhya");
      final_url = yt_url + songId + key;
      alb_name = AlbName;
      var myquery = { name: alb_name};
      axios.get(final_url).then(res=>{
      const yt_data = res.data;
      const views = yt_data.items[0].statistics.viewCount;
      var newvalues = { $push: { curAlbViews: views }};
      dbo.collection("albums").updateOne(myquery, newvalues, function(err, res) {
       if (err) throw err;
       console.log("Document Updated");
     });
});
});
}

//



