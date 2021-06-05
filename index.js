const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "welcome  to the api" });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post Created ...",
        authData
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  //Mock User
  const user = {
    id: 1,
    username: "shubham",
    email: "shubham@gmail.com",
  };

  jwt.sign({ user: user }, "secretKey",{expiresIn: '30s'}, (err, token) => {
    res.json({
      token,
    });
  });
});

//Verfiy Token
function verifyToken(req, res, next) {
  //Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(" ");
    //Get token from array
    const bearerToken = bearer[1];
    //Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    //Forbidden
    res.sendStatus(403);
  }
}

app.listen(3000, () => console.log("Server running on 3000"));
