const jwt = require('jsonwebtoken');
const secret = require('../config/default').secret;

module.exports = (req, res, next) => {
  //get token from header
  const token = req.header('x-auth-token');
  if (!token) {
    return res
      .status(401)
      .json({ errors: { msg: 'No token, authorization denied' } });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ errors: { msg: 'token is not valid' } });
  }
};
