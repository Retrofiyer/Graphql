const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    users: [User]
  }

  type Mutation {
    addUser(name: String!, age: Int!): User
  }

  type User {
    id: ID
    name: String
    age: Int
  }
`);

module.exports = schema;