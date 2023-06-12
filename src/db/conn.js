const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/vaadhya", {
     useNewUrlParser: true,
     useUnifiedTopology: true
}).then(() => {
    console.log("Second Stage Clear");
}).catch((e) => {
    console.log(e);
});