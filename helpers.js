//To retrieve user object by email
function getUserByEmail(email, database) {
  let objUser;
  for (let user in database) {
    if (database[user]["email"] === email) {
      objUser = database[user];
    }
  }
  return objUser;
}
//to generate random 6 character alphanumeric string
function generateRandomString() {
  let result = "";
  let length = 6;
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
//retrieve urls created by specific user
function urlsForUser(id, database) {
  let urls = {};
  for (let url in database) {
    if (database[url]["userID"] === id) {
      urls[url] = database[url];
    }
  }
  return urls;
}

module.exports = { getUserByEmail,generateRandomString,urlsForUser };
