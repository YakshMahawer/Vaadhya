/*
ALBUM SCHEMA FORMAT
"name": "",
"src": "Albums/",
"year": ,
"songs_id": []

SONG SCHEMA FORMAT
"song_name": "",
"album_id": "",
"album_img": "/Albums/",
"song_src": "/Songs/VAAD.mp3",
"singers": "",
"tags": []
*/

//https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=f7Gy_YtC-Xc&key=AIzaSyDwUGeRKMTCeslgQjETBgP1ozqlB0yX9s0
const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
//const fetch = require('node-fetch');
const path  = require("path");
require("./db/conn");
const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
const Album = require("./models/albumschema");
const Song = require("./models/songschema");
const History = require("./models/historyschema");
const ArrSong = require("./youtube/yt");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const {PythonShell} = require("python-shell");
//const pyshell = new PythonShell('src/recommend.py');
var Typo = require("typo-js");
const SpellChecker = require('simple-spellchecker');
var dictionary = SpellChecker.getDictionarySync("dictionar");
//Gives current directory path
const cur_dir = path.resolve();
const otherFiles = path.join(__dirname, "../views/partials");
const static_dir = path.join(cur_dir, "/public"); 
const userFiles = path.join(__dirname,"../views/user");
// To convert the output into JSON format
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(expressLayouts);
//To let access images and files present in that folder(Here public)
app.use(express.static(static_dir));
app.set('view engine','ejs');
app.set('views',userFiles);
// To let this API be accesable to other files
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  
//User Account Creation Process
//Schema for Create Account
const createSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    npassword: {
        type: String,
        required: true
    },
    cpassword: {
        type: String
    },
    type: {
        type: String,
        default: 'free'
    },
    tokens: [{
        token: String
    }]
});


createSchema.methods.generateAuthToken = async function(){
    try{
       const token = jwt.sign({phone: this.phone},"jeenemarnekikiskopadipyaarkarleghadidoghadi");
       this.tokens = this.tokens.concat({token:token});
       await this.save();
       return token;
    }
    catch(err){
        console.log(err);
    }
}

//Creating collection for New User Details
const Create = mongoose.model("Create", createSchema);

//Storing New User Data
app.post('/create',async (req,res) => {
    try {
        const data = await Create.findOne({phone:req.body.phone});
        console.log(data);
        if(data == null){
            try {
                const createUser = new Create({
                    phone: req.body.phone,
                    npassword: req.body.npassword
                });
                createUser.npassword = await bcrypt.hash(createUser.npassword, 10);
                const token = await createUser.generateAuthToken();
                res.cookie('SpotifyUsername', token, {
                    expires: new Date(Date.now() + 1000*60*60*24*30),
                    https: true
                });
                await createUser.save();
                res.redirect('/');
                //res.render('Your Account is Made'); 
            }
            catch (err) {
                console.log(err);
            }
        }
        else{
            res.send("User Already Exists, Try Another Username");
        }
    } catch (err) {
        console.log(err);
    }    
});

//Login User Checking
app.post('/login', async (req,res) => {
    const username = req.body.phone;
    const pass = req.body.password;
    const data = await Create.findOne({phone:username});
    const isSame = await bcrypt.compare(pass, data.npassword);
    if(data == null){
        res.send("Create Account")
    }
    else{
        if(isSame){
            const token = await data.generateAuthToken();
            res.cookie('SpotifyUsername', token, {
                expires: new Date(Date.now() + 1000*60*60*24*30),
                https: true
            });
            res.redirect('/');
            //res.send("Welcome");
        }
        else{
            res.send("Galat Details dalta hai");
        }
    }
});

//Logout of user
app.post("/logout", async (req,res)=>{
    try {
        const verifyUser = jwt.verify(req.cookies.SpotifyUsername, "jeenemarnekikiskopadipyaarkarleghadidoghadi");
        const username = verifyUser.phone;
        res.clearCookie("SpotifyUsername");
        const data = await Create.findOne({phone: username});
        data.tokens = [];
        await data.save();
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

//This POST Method to add albums via postman
app.post("/albums",async(req,res) => {
    try{
        if(req.body.length == undefined){
            const album = new Album(req.body);
            const create_album = await album.save();
        }
        else{
            for(var i = 0;i < req.body.length;i++){
                const album = new Album(req.body[i]);
                const create_album = await album.save();
            }
        }
        res.send("Data Added in Album");
    }
    catch(e) {
        console.log(e);
    };
    
});


//This POST Method to add songs via postman
app.post("/songs",async (req,res) => {
    try{
        if(req.body.length == undefined){
            const song = new Song(req.body);
            const create_song = await song.save();
        }
        else{
            for(var i = 0;i < req.body.length;i++){
                const song = new Song(req.body[i]);
                const create_song = await song.save();
            }
        }
        res.send("Data Added in Song");
    }
    catch(e) {
        console.log(e);
    };

});

app.get("/", async (req,res) => {
    try{
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("vaadhya");
            dbo.collection("albums").find({}).toArray(function(err, result) {
               if (err) throw err;
               curViewCount = 0;
               prevViewCount = 0;
               for(var k = 0; k < result.length; k++){
                  for(var a = 0; a< result[k].curAlbViews.length; a++){
                     prevViewCount += parseInt(result[k].prevAlbViews[a]);
                     curViewCount += parseInt(result[k].curAlbViews[a]);
                  }
                  if(curViewCount >= prevViewCount){
                     console.log(result[k].name + " : "+(curViewCount - prevViewCount)/result[k].curAlbViews.length);
                  }
                  else{
                     console.log("Code is wrong");
                  }
                  var myquery = { name: result[k].name};
                  var newvalues = { $set: { trends: (curViewCount - prevViewCount)/result[k].curAlbViews.length }};
                  dbo.collection("albums").updateOne(myquery, newvalues, function(err, res) {
                     if (err) throw err;
                     console.log("Updated Trends");
                  });
               }
             });
      });
       const file = await Album.find();
       const trending = await Album.find({}).sort({trends: -1});
       const latest = await Album.find({}).sort({created_at: -1});
       const old = await Album.find({}).sort({year: 1});
       try {
            const token = req.cookies.SpotifyUsername;
            console.log(token);
            if(token == undefined){
                const s = await res.render('index',{confusePath: 'index', suggestedChamps: file, trend: trending, newly: latest, oldisgold: old, userState: 'notLogged', userName: '', userType: ''});
            }
            else{
                const verifyUser = jwt.verify(token, "jeenemarnekikiskopadipyaarkarleghadidoghadi");
                const user = await Create.findOne({phone: verifyUser.phone});
                if(user == null){
                    const s = await res.render('index',{confusePath: 'index', suggestedChamps: file, trend: trending, newly: latest, oldisgold: old, userState: 'notLogged', userName: '', userType: ''});
                }
                else{
                    const s = await res.render('index',{confusePath: 'index', suggestedChamps: file, trend: trending, newly: latest, oldisgold: old, userState: 'Logged', userName: verifyUser.phone, userType: user.type});
                }
            } 
    } catch (err) {
        console.log(err);
    }
    }
    catch(e){
        console.log(e);
    }
});

//Remaining to add authentication at this page
/*app.get("/songs/:id", async (req,res)=>{
    const myid = req.params;
    const song_data = await Song.find({'album_id': myid.id});
    const s = await res.render('songs',{confusePath: 'song', songs: song_data});
});*/

//To get data of albums and use as an API
app.get("/albums",async (req,res) => {
    const data = await Album.find();
    res.send(data);
    res.end();
});
app.get("/songs",async (req,res) => {
    const data = await Song.find();
    res.send(data);
    res.end();
});
app.get("/songs/:id",async (req,res) => {
    const myid = req.params;
    const song_data = await Song.find({'album_id': myid.id});
    res.send(song_data);
    res.end();
});

app.get("/history", async (req, res) => {
    const token = req.cookies.SpotifyUsername;
    const verifyUser = jwt.verify(token, "jeenemarnekikiskopadipyaarkarleghadidoghadi");
    const history_data = await History.find({'username': verifyUser.phone});
    console.log(history_data);
    res.send(history_data);
});

app.post("/saveToHistory", async (req, res) => {
    console.log(req.body);
    const token = req.cookies.SpotifyUsername;
    const verifyUser = jwt.verify(token, "jeenemarnekikiskopadipyaarkarleghadidoghadi");
    const isThere = await History.find({username: verifyUser.phone, songID: req.body.SongId});
    if(isThere.length == 0){
        const createHistory = new History({
            username: verifyUser.phone,
            songID: req.body.SongId,
            songName: req.body.SongName,
            songSinger: req.body.SongSinger,
            songAlbum: req.body.SongAlbum
        });
        const saveHistory = await createHistory.save();
    }
    res.end();
});

//Searching 

app.get('/find/:word', async (req,res) => {
    const searchQ = req.params.word;
    const searchArr = searchQ.split('-');
    var arr = [];
    var i = 0;
    while(i < searchArr.length){
        arr = arr.concat(dictionary.getSuggestions(searchArr[i], 1));
        i++;
    }
    console.log(arr);
    var searchListData = [];
    i = 0;
    while(i < arr.length){
        var list = await Song.find({$or:[{song_name:new RegExp(arr[i], 'i')},{tags: new RegExp(arr[i], 'i')}]});
        searchListData = searchListData.concat(list);
        i++;
    }
    let newArray = [];
    // Declare an empty object
    let uniqueObject = {};
        
    // Loop for the array elements
    for (let i in searchListData) {
        
        // Extract the title
        objTitle = searchListData[i]['_id'];
        
        // Use the title as the index
        uniqueObject[objTitle] = searchListData[i];
    }
        
    // Loop to push unique object into array
    for (i in uniqueObject) {
        newArray.push(uniqueObject[i]);
    }
    
    res.send(newArray);
});

app.get("/random/:id", async (req,res) =>{
    //To add last played song in History Log
    const verifyUser = jwt.verify(req.cookies.SpotifyUsername, "jeenemarnekikiskopadipyaarkarleghadidoghadi");
    const userID = verifyUser.phone;
    const curSong = req.params.id;
    const curTags = await Song.find({'song_name': curSong});
    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: curTags[0]._id
    }
    //pyshell.send(JSON.stringify(data), { mode: 'json' });
    PythonShell.run('src/recommend.py', options, async function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        const similar = await Song.find({ _id: {$in : results}});
        res.send(similar);
    });
});



app.post("/payment", async (req,res) => {
    const sdk = require('api')('@cashfreedocs-new/v3#4xc3n730larv4wbt');
    try{
        const order_id = Date.now();
        const Order = order_id.toString();
        const amt = parseFloat(req.body.money);
        const username = req.body.username;
        sdk.createOrder({
            customer_details: {
              customer_id: req.body.username,
              customer_email: req.body.gmail,
              customer_phone: req.body.username
            },
            order_id: Order,
            order_amount: amt,
            order_currency: 'INR',
            order_meta: {
                return_url: `http://localhost:8000/p?order_id={order_id}`,
                notify_url: "https://b8af79f41056.eu.ngrok.io/webhook.php",
                payment_methods: null
              } 
          }, {
            'x-client-id': '294407d9578945a27fc16c5020704492',
            'x-client-secret': '3c86469a1a163a8437ca5b47018b4ce0ce7b8207',
            'x-api-version': '2022-09-01'
          }).then(({ data }) => {
                res.render('payOrder', {layout: false, session: data.payment_session_id, orderId: Order});
                console.log(data);
                res.end();
            })
            .catch(err => {
               res.send(err.data.message);
            });
    }catch(err){
        console.log(err);
    }
});

app.get("/upiid/:session", (req,res) => {
    const sdk = require('api')('@cashfreedocs-new/v3#4xc3n730larv4wbt');
    sdk.orderPay({
        payment_method: {upi: {channel: 'link'}},
        payment_session_id: req.params.session
      }, {'x-api-version': '2022-09-10'})
        .then(({ data }) => res.send(data))
        .catch(err => console.error(err));
});

app.get("/pay/:sessionId/:bankcode", (req,res) => {
    const sdk = require('api')('@cashfreedocs-new/v3#4xc3n730larv4wbt');
    sdk.orderPay({
        payment_method: {
          netbanking: {
            channel: 'link',
            netbanking_bank_code: parseInt(req.params.bankcode)
          }
        },
        payment_session_id: req.params.sessionId
      }, {'x-api-version': '2022-09-10'})
        .then(({ data }) => res.redirect(data.data.url))
        .catch(err => console.error(err));
});

app.post("/check/:order", (req,res) => {
    const sdk = require('api')('@cashfreedocs-new/v3#4xc3n730larv4wbt');
    sdk.getOrder({
        order_id: req.params.order,
        'x-client-id': '294407d9578945a27fc16c5020704492',
        'x-client-secret': '3c86469a1a163a8437ca5b47018b4ce0ce7b8207',
        'x-api-version': '2022-09-01'
      })
        .then(({ data }) => res.send(data))
        .catch(err => console.error(err));
});


app.get("/p", async (req,res) => {
    const sdk = require('api')('@cashfreedocs-new/v3#4xc3n730larv4wbt');
    sdk.getOrder({
        order_id: req.query.order_id,
        'x-client-id': '294407d9578945a27fc16c5020704492',
        'x-client-secret': '3c86469a1a163a8437ca5b47018b4ce0ce7b8207',
        'x-api-version': '2022-09-01'
      })
    .then(async ({ data }) => {
        if(data.order_status == 'PAID'){
            const user = await Create.findOneAndUpdate({phone: data.customer_details.customer_id}, {$set: {type: 'paid'}});
            res.redirect("/");
        }
        else{
            res.send("Failed Try Again");
        }
    })
    .catch(err => console.error(err));
});

const options = {
    onPaymentSuccess: ()=>{
        res.send("Success");
    },
    onPaymentFailure: () => {
        res.send("Falure");
    }
}
app.post("/card/:ps",async (req,res) => {
    res.end();
});

app.listen(8000,()=>{
    console.log("Connection Successful");
});

