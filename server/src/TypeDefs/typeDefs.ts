import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    phoneNo: String!
    password: String!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    register(
      username: String!
      firstName: String!
      lastName: String!
      email: String!
      phoneNo: String!
      password: String!
    ): Boolean!
    login(email: String!, password: String!): User
  }
`;
