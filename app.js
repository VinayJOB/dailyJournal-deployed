//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");

const mongoose=require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


var homeStartingContent = " The daily log is when you journal about your day-to-day: what you did, what you ate, who you saw and spoke with. Whatever you want. It’s a working way to log your life. The best part about this journaling habit is that you literally have a hand-written record of what you’ve done on any given day… And believe me when I tell you that it comes in handy.Gratitude journaling can be done anytime during the day, but I’d recommend doing it in the morning before beginning your workday. Why? Because genuine gratitude reverberates into the rest of your entire day, setting off a domino effect of optimism with which you can approach your work, your clients, your family, and everyone else you cross paths with.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// =========== connecting with mongoose database==========

const USERNAME = process.env.USER;
const KEY =  process.env.KEY;

const AtlasHost = "mongodb+srv://"+USERNAME + ":" + KEY +"@todolist.n0hoz.mongodb.net/DailyJournal";
const LocalMongo = "mongodb://localhost/journalDB";


mongoose.connect(AtlasHost,{useNewUrlParser:true,useUnifiedTopology: true})
// ===============created schema for dailyJournal database==========
const dailyJournalSchema= new mongoose.Schema({
  title:String,
  content:String
});
//=============created model for the schema================
const Journal = mongoose.model("Journal",dailyJournalSchema);


app.get("/",function(req,res){
  Journal.find({},function(err,docs){
    if(!err){
      res.render("home",{homeStartingContent : homeStartingContent,postDocs:docs});
    }
  });
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent : aboutContent})
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent : contactContent})
});

app.get("/compose",function(req,res){
  res.render("compose",{msg :"",className:"",hiddenButton:""});
});


app.post("/compose",function(req,res){      
  const title= req.body.postTitle;
  const content=req.body.postBody;
  const journalDetail= new Journal({
    title:title,
    content:content
  });
  if(title=="" && content==""){

    res.render("compose",{msg:"Please Enter the all details ! ",className:"alert alert-danger",hiddenButton:""});
  }
  else if(title.length>0 && content.length==0){
    res.render("compose",{msg:"Please Type your Post ",className:"alert alert-danger",hiddenButton:""})
  }
  else if(title.length==0 && content.length>0){
    res.render("compose",{msg:"Please Type Your Title ",className:"alert alert-danger",hiddenButton:""})
  }
  else{    
    journalDetail.save();
    res.render("compose",{msg:"Successfully submited ",className:"alert alert-success",hiddenButton:"hiddenButton"});
   
  }
});

app.get("/posts/:postURL",function(req,res){
  const postURL=req.params.postURL; 
    Journal.findById(postURL,function(err,docs){
     const title = lodash.capitalize(docs.title);
     const content = lodash.capitalize(docs.content);
         res.render("post",{postTitleName: title,postBodyName: content});      
    })  ;
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
