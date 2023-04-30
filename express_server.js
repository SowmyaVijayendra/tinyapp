const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.urlencoded({ extended: true }));//body-parser library - converts request body from a buffer to string

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//to handle home page by returning a text
app.get("/", (req, res) => {
  res.send("Hello!");
});
//to handle another endpoint to return json object 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase.id };
  res.render("urls_show", templateVars);
});
app.get("/urls",(req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortUrl =generateRandomString(); // generate a random string for short url
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/u/${shortUrl}`); // Redirect to shorturl generated
});

app.get("/u/:id", (req, res) => { // get request following redirect from POST
   const longURL = urlDatabase[req.params.id];
  res.redirect(longURL); // redirect to long url of the short url
});
app.post("/urls/:id/delete", (req, res) => {
  console.log(req.body); // Log the POST request body to the console  
 delete urlDatabase[req.params.id]; //delete from the DB
  res.redirect("/urls"); // Redirect to index page
});
app.post("/urls/:id/edit", (req, res) => {
  console.log(req.body); // Log the POST request body to the console  
  res.redirect(`/urls/${req.params.id}`); // Redirect to show page
});
app.post("/urls/:id", (req, res) => {
  console.log(req.body); // Log the POST request body to the console 
  console.log(req.params.id) ;
  urlDatabase[req.params.id] = req.body.newLongURL;
  res.redirect("/urls"); // Redirect to index page
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//to generate random 6 character alphanumeric string
function generateRandomString() {
  let result = '';
  let length = 6;
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}