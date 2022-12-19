import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import cookieParser from "cookie-parser";
import { typeDefs } from "./TypeDefs/typeDefs";
import { resolvers } from "./Resolvers/resolvers";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "./Utils/constants";
import cors from "cors";
import helmet from "helmet";
import http from "http";

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }: any) => ({ req, res }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await createConnection();
  app.use(cookieParser());

  app.use((req, _, next) => {
    const accessToken = req.cookies["access-token"];
    try {
      const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any;
      (req as any).userId = data.userId;
    } catch {}
    next();
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: [
        "http://localhost:4000/graphql",
        "https://studio.apollographql.com",
      ],
      credentials: true,
    })
  );

  server.applyMiddleware({ app });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

startServer();
