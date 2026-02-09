const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "ademolalookman",
    password: "1234"
  }
];

const isValid = (username)=>{
  if (username.includes("_") || username.includes(" ") || username.includes("-") || username.includes("@") || username.includes(",")) {
    return false;
  }
  return true;
}

const doesUserExist = (username)=>{ //returns boolean
  const user = users.find(user => user.username === username);
  
  if(user){
    return true;
  }

  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(user => user.username === username && toString(user.password) === toString(password));

  if(!user){
    return false;
  }

  return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username, password)

  if (!authenticatedUser(username,password)) {
    return res.status(401).json({message: "Invalid username or password"});
  }

  const token = jwt.sign({username: username}, 'access', {expiresIn: "1h"});

  req.session.authorization = {accessToken: token};

  return res.status(300).json({message: "User logged in successfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const review = req.body.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(300).json({message: "Review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(300).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesUserExist = doesUserExist;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;