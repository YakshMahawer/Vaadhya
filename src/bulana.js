//Calling API using Fetch API...
/*
const fetch = require('node-fetch');
const ArrSong = require("./youtube/yt");
console.log(ArrSong);


var url = "https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=";
var key = "&key=AIzaSyDwUGeRKMTCeslgQjETBgP1ozqlB0yX9s0";
var final_url;
var arr_song = [];
var arr_views = [];

function getYTData(songId){
   final_url = url + songId + key;
   fetch(final_url).then((res)=>{
      return res.json();
   }).then((data)=>{
      arr_song.push(songId);
      arr_views.push(data.items[0].statistics.viewCount);
   });
} 


async function getData(){
   const response = await fetch("http://localhost:8080/albums/");
   const albums = await response.json();
   return albums;
}

let a = getData();
a.then((data) => {
   album_data = data;
   for(var i = 0;i<album_data.length;i++){
      for(var j = 0;j<album_data[i].songs_id.length;j++){
         getYTData(album_data[i].songs_id[j]);
      }
   }
   //console.log(album_data);
});

//import fetch from 'node-fetch'
const ArrSong = arr_song;
//module.exports = ArrSong;
console.log(arr_views);
console.log(ArrSong);
*/

//Calling API using XMLHttpRequest i.e. Ajax

/*
var url = "https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=";
var key = "&key=AIzaSyDwUGeRKMTCeslgQjETBgP1ozqlB0yX9s0";
var id = 'sAzlWScHTc4';
var final_url;
var arr_song = [];
var arr_views = [];
var XMLHttpRequest = require('xhr2');
const request = new XMLHttpRequest();
request.open("GET", "http://localhost:8000/albums/");
request.send();
request.onload = () => {
   const album_data = JSON.parse(request.response);
   for(var i = 0;i<album_data.length;i++){
      for(var j = 0;j<album_data[i].songs_id.length;j++){
         getYTData(album_data[i].songs_id[j]);
      }
   }
}

function getYTData(songId){
   final_url = url + songId + key;
   const yt_request = new XMLHttpRequest();
   yt_request.open("GET", final_url);
   yt_request.send();
   yt_request.onload = () => {
      const yt_data = JSON.parse(yt_request.response);
      console.log(songId);
      console.log(yt_data.items[0].statistics.viewCount);
      arr_song.push(songId);
      arr_views.push(yt_data.items[0].statistics.viewCount);
   }
}

console.log(arr_song);
console.log(arr_views);
const ArrSong = arr_song;
*/

//Calling API Using Axios
/*
const axios = require('axios').default;
var url = "https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=";
var key = "&key=AIzaSyDwUGeRKMTCeslgQjETBgP1ozqlB0yX9s0";
var id = 'sAzlWScHTc4';
var final_url;
var arr_song = [];
var arr_views = [];

axios.get('http://localhost:8000/albums/').then(res=>{
   const album_data = res.data;
   for(var i = 0;i<album_data.length;i++){
      for(var j = 0;j<album_data[i].songs_id.length;j++){
         getYTData(album_data[i].songs_id[j]);
      }
   }
});

function getYTData(songId){
   final_url = url + songId + key;
   axios.get(final_url).then(res=>{
   const yt_data = res.data;
   console.log(songId);
   console.log(yt_data.items[0].statistics.viewCount);
   arr_song.push(songId);
   arr_views.push(yt_data.items[0].statistics.viewCount);
});
}

console.log(arr_song);
console.log(arr_views);
const ArrSong = arr_song;
*/
/*const axios = require('axios').default;
var url = "https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=";
var key = "&key=AIzaSyDwUGeRKMTCeslgQjETBgP1ozqlB0yX9s0";
var id = 'sAzlWScHTc4';
var final_url;
var arr_song = [];
var arr_views = [];

function getYTData(songId){
   final_url = url + songId + key;
   axios.get(final_url).then(res=>{
   const yt_data = res.data;
   console.log(songId);
   console.log(yt_data.items[0].statistics.viewCount);
   arr_song.push(songId);
   arr_views.push(yt_data.items[0].statistics.viewCount);
});
}

function getting_data(){
   axios.get('http://localhost:8000/albums/').then(res=>{
   const album_data = res.data;
   for(var i = 0;i<album_data.length;i++){
      for(var j = 0;j<album_data[i].songs_id.length;j++){
         getYTData(album_data[i].songs_id[j]);
      }
   }
});
}

const ArrSong = arr_song;

/*
const MongoClient = require("mongodb").MongoClient;
const axios = require("axios").default;
var url = "mongodb://localhost:27017/";
var yt_url = "https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=";
var key = "&key=AIzaSyDwUGeRKMTCeslgQjETBgP1ozqlB0yX9s0";
var final_url;

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
*/
/*
{{#each trend}}
                        <div class="albums">
                            <div class="album_img"><img src="<%=this.src%>" alt="" srcset="">
                            <p class="album_name"><%= this.name %></p>
                            <button class="khufiya_button" type="button" onclick="location.href = '/songs/{{this._id}}'">Click</button>
                            </div>
                        </div>
                        {{/each}}

*/