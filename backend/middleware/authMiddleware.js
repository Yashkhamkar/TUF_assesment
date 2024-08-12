const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token:", token); // Debugging line
  if (!token) return res.status(403).json({ error: "No token provided" });

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("Decoded token:", decoded); // Debugging line

    // Check if the user is an admin
    console.log("Role:", decoded.role); // Debugging line
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Attach user information to the request object
    req.user = decoded;
    next();
  });
};

module.exports = { protect };
