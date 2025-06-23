const express = require("express");
const rateLimiter = require("./sdk");
const jwt = require("jsonwebtoken");

const app = express();

//Route to generate test JWT (no middleware here)
app.get("/token", (req, res) => {
  const token = jwt.sign(
    { userId: "u123", orgId: "org456" },
    "secret123", // must match the secret used in sdk/index.js
    { expiresIn: "1h" }
  );
  res.json({ token });
});

// Protected route (uses your rate-limiting SDK middleware)
app.get("/protected", rateLimiter(), (req, res) => {
  res.send("Access granted. You're within your rate limit.");
});

// Start server
app.listen(5000, () => {
  console.log("SDK Test Server running at http://localhost:5000");
  console.log("Get token:   http://localhost:5000/token");
  console.log("Protected:   http://localhost:5000/protected");
});
