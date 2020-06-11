const { ApolloServer } = require("apollo-server");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { uri } = require("./configs/mongo");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("MongoDB connected successfully");
    return server.listen(port);
  })
  .then((res) => {
    console.log(`server is listening on ${res.url}`);
  })
  .catch((err) => {
    throw new Error(err);
  });
