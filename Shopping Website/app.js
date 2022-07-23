var express = require("express");
var path = require("path");
var fs = require("fs");
const { render } = require("express/lib/response");

var app = express();

var session = require('express-session');
const { resolveNaptr } = require("dns");

app.use(session({
  secret:"express-session",
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("login", { messages: "" });
});

app.post("/", async function (req, res) {
  var z = req.body.username;
  var s = req.body.password;

  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();

  let user = await client.db("samna").collection("firstcollection").findOne({username:z, password:s});

  if(user == null){
    res.render("login",{messages:"Account not found"});
  }
  else{
    req.session.username = z;
    req.session.password = s;
    req.session.cart = user.cart;
    res.render("home");
  }
});

app.get("/registration", function (req, res) {
  res.render("registration",{message:""});
});

app.post("/register", async function (req, res) {
  var x = req.body.username;
  var y = req.body.password;

  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();

  if(x!="" && y!=""){
    let user = await client.db("samna").collection("firstcollection").findOne({username:x});

    if(user == null){
    var currentuser = {username: x, password: y, cart:[""]};
    req.session.username = x;
    req.session.password = y;
    req.session.cart = [""];
    await client.db("samna").collection("firstcollection").insertOne(currentuser);
    res.render("home");
    }
    else{
      res.render("registration",{message:"Username already exists!"});
    }
  }
  else{
    res.render("registration",{message:"Please enter all fields!"});  }
});

app.get("/books", function (req, res) {
  if(req.session.username)
     res.render("books");
});

app.get("/sports", function (req, res) {
  if(req.session.username)
  res.render("sports");
});

app.get("/phones", function (req, res) {
  if(req.session.username)
  res.render("phones");
});

app.get("/cart", async function (req, res) {
  if(req.session.username){
    var { MongoClient } = require("mongodb");
    var uri =
      "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
    var client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    
    let carttmp= await client.db("samna").collection("firstcollection").findOne({username:req.session.username})
        res.render("cart",{itemcart:carttmp.cart});
  }
});

app.post("/addtocartiphone", async function(req, res){
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  let carttmp= await client.db("samna").collection("firstcollection").findOne({username:req.session.username})

  if(carttmp.cart.includes("iphone")){
    res.render("iphone",{messages:"Item already in cart!"});
  }
  else{
    res.render("iphone",{messages:"Item added to cart successfully!"});
    await client.db("samna")
  .collection("firstcollection").updateOne({username:req.session.username}, {$push: {cart:"iphone"}});
  }

})

app.post("/addtocartgalaxy", async function(req, res){
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  let carttmp= await client.db("samna").collection("firstcollection").findOne({username:req.session.username})

  if(carttmp.cart.includes("galaxy")){
    res.render("galaxy",{messages:"Item already in cart!"});
  }
  else{
    res.render("galaxy",{messages:"Item added to cart successfully!"});
    await client.db("samna")
  .collection("firstcollection").updateOne({username:req.session.username}, {$push: {cart:"galaxy"}});
  }
})

app.post("/addtocartleaves", async function(req, res){
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  let carttmp= await client.db("samna").collection("firstcollection").findOne({username:req.session.username})

  if(carttmp.cart.includes("leaves")){
    res.render("leaves",{messages:"Item already in cart!"});
  }
  else{
    res.render("leaves",{messages:"Item added to cart successfully!"});
    await client.db("samna")
  .collection("firstcollection").updateOne({username:req.session.username}, {$push: {cart:"leaves"}});
  }
})

app.post("/addtocartsun", async function(req, res){
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  let carttmp= await client.db("samna").collection("firstcollection").findOne({username:req.session.username})

  if(carttmp.cart.includes("sun")){
    res.render("sun",{messages:"Item already in cart!"});
  }
  else{
    res.render("sun",{messages:"Item added to cart successfully!"});
    await client.db("samna")
  .collection("firstcollection").updateOne({username:req.session.username}, {$push: {cart:"sun"}});
  }
})

app.post("/addtocartboxing", async function(req, res){
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  let carttmp= await client.db("samna").collection("firstcollection").findOne({username:req.session.username})

  if(carttmp.cart.includes("boxing")){
    res.render("boxing",{messages:"Item already in cart!"});
  }
  else{
    res.render("boxing",{messages:"Item added to cart successfully!"});
    await client.db("samna")
  .collection("firstcollection").updateOne({username:req.session.username}, {$push: {cart:"boxing"}});
  }
})

app.post("/addtocarttennis", async function(req, res){
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  
  let carttmp= await client.db("samna").collection("firstcollection").findOne({username:req.session.username})

  if(carttmp.cart.includes("tennis")){
    res.render("tennis",{messages:"Item already in cart!"});
  }
  else{
    res.render("tennis",{messages:"Item added to cart successfully!"});
    await client.db("samna")
  .collection("firstcollection").updateOne({username:req.session.username}, {$push: {cart:"tennis"}});
  }
})

app.get("/galaxy", function (req, res) {
  if(req.session.username)
  res.render("galaxy",{messages:""});
});

app.get("/iphone", function (req, res) {
  if(req.session.username)
  res.render("iphone",{messages:""});
});

app.post("/backtohome", function(req,res){
  res.render("home");
});

app.get("/leaves", function (req, res) {
  if(req.session.username)
  res.render("leaves",{messages:""});
});

app.get("/sun", function (req, res) {
  if(req.session.username)
  res.render("sun",{messages:""});
});

app.get("/boxing", function (req, res) {
  if(req.session.username)
  res.render("boxing",{messages:""});
});

app.get("/tennis", function (req, res) {
  if(req.session.username)
  res.render("tennis",{messages:""});
});

app.get("/galaxy%20s21%20ultra", function (req, res) {
  if(req.session.username)
  res.render("galaxy",{messages:""});
});

app.get("/iphone%2013%20pro", function (req, res) {
  if(req.session.username)
  res.render("iphone",{messages:""});
});

app.get("/leaves%20of%20grass", function (req, res) {
  if(req.session.username)
  res.render("leaves",{messages:""});
});

app.get("/the%20sun%20and%20her%20flowers", function (req, res) {
  if(req.session.username)
  res.render("sun",{messages:""});
});

app.get("/boxing%20bag", function (req, res) {
  if(req.session.username)
  res.render("boxing",{messages:""});
});

app.get("/tennis%20racket", function (req, res) {
  if(req.session.username)
  res.render("tennis",{messages:""});
});

app.post("/search", function (req, res) {
  var s=req.body.Search;
  var included=[""];
    for (i=0;i<items.length;i++){
       if(items[i].includes(s) && s!="")
           included.push(items[i]);

  }
  if(included.length==1)
  {
    res.render("searchresults",{itm:included,message:"Not Found"});
  }else
  res.render("searchresults",{itm:included,message:""});
});

//app.get("/home", function (req, res) {});

//Mongo atlas connection
async function main() {
  var { MongoClient } = require("mongodb");
  var uri =
    "mongodb+srv://admin:admin12345@cluster0.n9yvd.mongodb.net/samna?retryWrites=true&w=majority";
  var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();

  //await client.db("samna").createCollection("secondcollection"); //creating a new collection

  /*var user1 = { username: "Aya", password: "12345", cart:[]};
  await client.db("samna").collection("firstcollection").insertOne(user1);

  var user2 = { username: "Mariam", password: "123456", cart:[]};
  await client.db("samna").collection("firstcollection").insertOne(user2);*/

  //var user3 = { username: "Nourhan", password: "1234", cart:[""] };
  //await client.db("samna").collection("firstcollection").insertOne(user3);

  /*var user4 = { username: "Sara", password: "12345678", cart:[] };
  await client.db("samna").collection("firstcollection").insertOne(user4);

  var user5 = { username: "Mariam", password: "123456789", cart:[] };
  await client.db("samna").collection("firstcollection").insertOne(user5);*/

  /*var output = await client
    .db("samna")
    .collection("firstcollection")
    .find()
    .toArray();*/
  //console.log(output);

  client.close();
}

let items=['galaxy s21 ultra','iphone 13 pro','boxing bag','tennis racket','the sun and her flowers','leaves of grass'];

main().catch(console.error);

//app.listen(3000);

if(process.env.PORT){
  app.listen(process.env.PORT,function(){console.log("Server started")});
}
else{
  app.listen(3000,function(){console.log("Server started on port 3000")});
}