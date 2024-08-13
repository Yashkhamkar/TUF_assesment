const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const connection = require("../utils/db"); // Assuming your MySQL connection is exported from this file
const generateToken = require("../utils/generateToken");

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;
  console.log(req.body);

  try {
    // Check if the user already exists
    const userExists = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await connection.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role || "user"]
    );

    res.status(201).json({
      id: result.insertId,
      username,
      role: role || "user",
      token: generateToken({ id: result.insertId, role: role || "user" }),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Database query failed", error: err.message });
  }
});

// Authenticate a user
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  console.log(username);

  try {
    // Find the user in the database
    const users = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({
        id: user.id,
        username: user.username,
        role: user.role,
        token: generateToken({ id: user.id, role: user.role }),
      });
      console.log("User authenticated");
    } else {
      console.log("Invalid credentials");
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Database query failed", error: err.message });
  }
});

module.exports = { registerUser, authUser };
