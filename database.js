const bcrypt = require("bcryptjs"); // for hashing passwords

//database for storing URLs
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "user3RandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user3RandomID",
  },
  t6S7cQ: {
    longURL: "https://www.amazon.ca",
    userID: "userRandomID",
  },
};
//Database for storing Users
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

module.exports ={urlDatabase, users};