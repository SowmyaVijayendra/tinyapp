const express = require("express");
var cookieSession = require('cookie-session');//middle ware
const bcrypt = require("bcryptjs"); // for hashing passwords
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.urlencoded({ extended: true })); //body-parser library - converts request body from a buffer to string
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'], 
}));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "user3RandomID"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user3RandomID"
  },
  t6S7cQ: {
    longURL: "https://www.amazon.ca",
    userID: "userRandomID"
  },
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("xyz", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("pqr", 10),
  },
  user3RandomID: {
    id: "user3RandomID",
    email: "user3@example.com",
    password: bcrypt.hashSync("abc", 10),
  },
};
//to display new urls page
app.get("/urls/new", (req, res) => {
  if(req.session.user_id){ //if user is already logged in, redirect to urls/new page
    const templateVars = { user: users[req.session.user_id] };
    res.render("urls_new", templateVars);
 }
 else{ //if not logged in, redirect to login page
  res.redirect("/login"); // Redirect to login page
 }
});
//to display specific url page
app.get("/urls/:id", (req, res) => {
  if(req.session.user_id){// display only if logged in
    if(!urlDatabase.hasOwnProperty(req.params.id)){
      const templateVars = {message:`Sorry, Requested url ${req.params.id} does not exist.`};
      res.render("urls_error", templateVars);
      return;
    }
    if(urlDatabase[req.params.id]["userID"] === req.session.user_id){
      const templateVars = {
        user: users[req.session.user_id],
        id: req.params.id,
        longURL: urlDatabase[req.params.id].longURL,
      };
      res.render("urls_show", templateVars);
    }else{
      const templateVars = {message:`You are not authorised to view ${req.params.id}`};
      res.render("urls_error", templateVars);
    } 
  }
  else{
    const templateVars = {message:"Please login or register."};
    res.render("urls_error", templateVars);
  }
});
//to display list of all urls
app.get("/urls", (req, res) => {
  if(req.session.user_id){
    let urlsByUser = urlsForUser(req.session.user_id);
    const templateVars = {
      user: users[req.session.user_id],
      urls: urlsByUser,
    };
    res.render("urls_index", templateVars);
  }else{
    const templateVars = {message:"Please login or register."};
    res.render("urls_error", templateVars);
  }
  
});
//post handler when redirected to urls page
app.post("/urls", (req, res) => {//if user is logged in, save new short url to DB
  if(req.session.user_id){    
    const shortUrl = generateRandomString(); // generate a random string for short url
    urlDatabase[shortUrl] ={};   
    urlDatabase[shortUrl]["longURL"]=req.body.longURL;
    urlDatabase[shortUrl]["userID"]=req.session.user_id;   
    res.redirect(`/u/${shortUrl}`); // Redirect to shorturl generated
  }else{
    const templateVars = {message: "Please login to create tiny URLs"};
    res.render("urls_error", templateVars);
  }  
});

app.get("/u/:id", (req, res) => {
  // get request following redirect from POST  
  if(urlDatabase.hasOwnProperty(req.params.id)){//if shortened url exists
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL); // redirect to long url of the short url
  }else{
    const templateVars = {message: `${req.params.id} does not exist in the Database`};
    res.render("urls_error", templateVars);
  }
 
});
app.post("/urls/:id/delete", (req, res) => {
  if(req.session.user_id){// display only if logged in
    if(!urlDatabase.hasOwnProperty(req.params.id)){
      const templateVars = {message:`Sorry, Requested url ${req.params.id} does not exist.`};
      res.render("urls_error", templateVars);
      return;
    }
    if(urlDatabase[req.params.id]["userID"] === req.session.user_id){// delete only user owns the url
      delete urlDatabase[req.params.id]; //delete from the DB
      res.redirect("/urls"); // Redirect to index page
    }
    else{
      const templateVars = {message:`You are not authorised to delete ${req.params.id}`};
      res.render("urls_error", templateVars);
    }   
  }
  else{
    const templateVars = {message:"Please login or register."};
    res.render("urls_error", templateVars);
  }
  
});
app.post("/urls/:id/edit", (req, res) => {
  if(req.session.user_id){// display only if logged in
    if(!urlDatabase.hasOwnProperty(req.params.id)){
      const templateVars = {message:`Sorry, Requested url ${req.params.id} does not exist.`};
      res.render("urls_error", templateVars);
      return;
    }
    if(urlDatabase[req.params.id]["userID"] === req.session.user_id){// edit only user owns the url
      res.redirect(`/urls/${req.params.id}`); // Redirect to show page
    }
    else{
      const templateVars = {message:`You are not authorised to edit ${req.params.id}`};
      res.render("urls_error", templateVars);
    }   
  }
  else{
    const templateVars = {message:"Please login or register."};
    res.render("urls_error", templateVars);
  }  
});
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id]["longURL"] = req.body.newLongURL;
  res.redirect("/urls"); // Redirect to index page
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login"); // Redirect to index page
});
app.get("/register", (req, res) => {
  if(req.session.user_id){ //if user is already logged in, redirect to urls page
    res.redirect("/urls"); // Redirect to index page
 }
 else{
  // get request for registering
  res.render("urls_register");
 }
});
app.post("/register", (req, res) => {
  //handler for register
  if (!req.body.email || !req.body.password) {
    // if either or both email aor pawd is empty, return 400 status
    res.statusMessage = "Username or Password is empty";
    res.status(400).end();
    return;
  } else if (getUserByEmail(req.body.email)) {
    //if username already exists in the DB, return 400 error status
    res.statusMessage = "Username already exists";
    res.status(400).end();
    return;
  }
  let user = {};
  user["id"] = generateRandomString();
  user["email"] = req.body.email;
  user["password"] = bcrypt.hashSync(req.body.password, 10); 
  users[user["id"]] = user;  
  req.session.user_id = user["id"];
  res.redirect("/urls"); // Redirect to index page
});
app.get("/login", (req, res) => {
  if(req.session.user_id){ //if user is already logged in, redirect to urls page
     res.redirect("/urls"); // Redirect to index page
  }
  else{
// get request for login page
  res.render("urls_login");
  }
});
app.post("/login", (req, res) => {
  //handler for login
  if (!req.body.email || !req.body.password) {
    // if either or both email aor pawd is empty, return 400 status
    res.statusMessage = "Username or Password is empty";
    res.status(400).end();
  }
  let user = getUserByEmail(req.body.email);
  if (!user) {
    //if user is not found in DB, return 403
    res.statusMessage = "User not found!";
    res.status(403).end();
    return;
  }
  if(!bcrypt.compareSync(req.body.password, user.password)){   
    res.statusMessage = "Wrong password";
    res.status(403).end();
    return;
  }  
  req.session.user_id = Object.keys(users).find(key => users[key] === user);
  res.redirect("/urls"); // Redirect to index page
});
app.listen(PORT, () => { 
  console.log(`Example app listening on port ${PORT}!`);
});
//to generate random 6 character alphanumeric string
function generateRandomString() {
  let result = "";
  let length = 6;
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
//To retrieve user object by email
function getUserByEmail(email) {
  for (let user in users) {
    if (users[user]["email"] === email) {     
      return users[user];
    }
  }
}
//retrieve urls created by specific user
function urlsForUser(id){
  let urls = {};
  for(let url in urlDatabase){
    if(urlDatabase[url]["userID"] === id){
      urls[url] = urlDatabase[url];
    }
  }    
  return urls;
}
