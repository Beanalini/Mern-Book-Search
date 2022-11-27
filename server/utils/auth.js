const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ( { req }) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token ||req.headers.authorization;

    // ["Bearer", "<tokenvalue>"] split token into an array
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    console.log("server auth");
    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log(data);
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    console.log("in server auth");
    console.log(payload);

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
