const jwt = require("jsonwebtoken");

module.exports = function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "No authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "replace_this_with_a_strong_secret");

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
