import { IResolvers } from "@graphql-tools/utils";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

import { User } from "../Entities/user";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../Utils/constants";

export const resolvers: IResolvers = {
  Query: {
    currentUser: (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }

      return User.findOne(req.userId);
    },
  },
  Mutation: {
    register: async (
      _,
      { username, firstName, lastName, phoneNo, email, password }
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        firstName,
        lastName,
        phoneNo,
        email,
        password: hashedPassword,
      }).save();

      return true;
    },
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      const refreshToken = sign(
        { userId: user.id, count: user.count },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const accessToken = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
        expiresIn: "15min",
      });

      res.cookie("refresh-token", refreshToken);
      res.cookie("access-token", accessToken);

      console.log("Refresh Token: " + refreshToken);
      console.log("Access Token: " + accessToken);

      return user;
    },
  },
};
