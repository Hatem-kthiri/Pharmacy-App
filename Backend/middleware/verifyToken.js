const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // Get the token from the request headers, cookies, or wherever it's stored
  const token = req.headers.authorization;
  // Verify and decode the token to extract the user ID
  try {
    // Replace 'your-secret-key' with your actual secret key

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Save the user ID to req.user
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authenticateUser;
