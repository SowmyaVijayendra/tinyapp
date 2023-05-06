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

module.exports= {getUserByEmail};