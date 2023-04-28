const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

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
// end point to return HTML content
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});