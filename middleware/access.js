const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");

      req.user = user;
      next();
    });
  } else {
    return res.status(403).json("You are not authorized!");
  }
};

const isAdminAndSrManager = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "sr_manager") {
      next();
    } else {
      return res.status(403).json("You are not allowed to do that.");
    }
  });
};

module.exports = {
  verifyToken,
  isAdminAndSrManager,
};
