const jwt = require("jsonwebtoken");
const { MY_SECRET } = require("../configs/jwt");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    //   check for the authorization header and split the Response
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        // Verify the token
        const user = jwt.verify(token, MY_SECRET);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid or expired token");
      }
    } else {
      throw new Error("Authentication token must be Bearer's [token]");
    }
  }
  throw new Error("Authorization header must be provided");
};
