import { ApolloServer, gql, AuthenticationError } from "apollo-server-micro";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import {
  User,
  ListInput,
  UserInput,
  List,
  Item,
  ListEditInput,
  CommentInput,
} from "../types";
import { compare } from "bcrypt";
import { Models, initModels } from "./models";
import DataLoader from "dataloader";

interface Context {
  res: NextApiResponse;
  models: Models;
  itemsLoader: DataLoader<string, Item[], string>;
  areListsLikedLoader?: DataLoader<string, boolean, string>;
  user?: string;
}

const typeDefs = gql`
  input ItemInput {
    content: String!
  }

  input ItemEditInput {
    id: ID
    content: String!
  }

  type Item {
    id: ID!
    content: String!
  }

  input ListInput {
    name: String!
    items: [ItemInput!]!
  }

  input ListEditInput {
    id: ID!
    items: [ItemEditInput!]!
    deleted: [ID!]!
  }

  type List {
    id: ID!
    name: String!
    author: String!
    items: [Item!]!
    comments: [Comment!]!
    commentCount: Int!
    likes: Int!
    likedByUser: Boolean!
    createdAt: String!
  }

  input CommentInput {
    content: String!
    listId: ID!
  }

  type Comment {
    id: ID!
    content: String!
    author: String!
    createdAt: String!
  }

  input UserInput {
    username: String!
    password: String!
  }

  type User {
    username: String!
    createdAt: String!
    lists: [List!]!
    likedLists: [List!]!
    followerCount: Int!
    followingCount: Int!
    followedByUser: Boolean!
  }

  type Query {
    currUser: String
    allLists: [List!]!
    listById(id: String!): List
    listsFromFollowed: [List!]!
    allUsers: [User!]!
    userByName(username: String!): User
  }

  type Mutation {
    login(input: UserInput!): String!
    logout: String
    createList(input: ListInput!): List!
    removeList(id: String!): List!
    updateList(input: ListEditInput!): List!
    likeList(id: String!): List!
    createComment(input: CommentInput!): Comment!
    createUser(input: UserInput!): User!
    followUser(username: String!): User!
  }
`;

const resolvers = {
  List: {
    items: (parent: List, _args: object, context: Context) =>
      context.itemsLoader.load(parent.id as string),
    comments: (parent: List, _args: object, context: Context) =>
      context.models.Comment.getByListId(parent.id as string),
    likedByUser: (parent: List, _args: object, context: Context) =>
      context.user
        ? context.areListsLikedLoader.load(parent.id as string)
        : false,
  },
  User: {
    lists: (parent: User, _args: object, context: Context) =>
      context.models.List.getByAuthor(parent.username),
    likedLists: (parent: User, _args: object, context: Context) =>
      context.models.List.getLikedByUser(parent.username),
    followedByUser: (parent: User, _args: object, context: Context) =>
      context.user
        ? context.models.User.isUserFollowed(parent.username)
        : false,
  },
  Query: {
    currUser: (_parent: object, _args: object, context: Context) =>
      context.user,
    allLists: (_parent: object, _args: object, context: Context) =>
      context.models.List.getAll(),
    listById: (_parent: object, { id }: { id: string }, context: Context) =>
      context.models.List.getById(id),
    listsFromFollowed: (_parent: object, _args: object, context: Context) =>
      context.models.List.getFromFollowed(),
    allUsers: (_parent: object, _args: object, context: Context) =>
      context.models.User.getAll(),
    userByName: (
      _parent: object,
      { username }: { username: string },
      context: Context
    ) => context.models.User.getByUsername(username),
  },
  Mutation: {
    login: async (_parent: object, { input }, context: Context) => {
      const user = await context.models.User.getByUsername(input.username);

      if (!user || !(await compare(input.password, user.password))) {
        throw new AuthenticationError("Invalid credentials");
      }

      const token = jwt.sign({ username: user.username }, process.env.SECRET);
      context.res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; SameSite=Strict`
      );
      return user.username;
    },
    logout: (_parent: object, _args: object, context: Context) => {
      if (!context.user) {
        return null;
      }
      context.res.setHeader(
        "Set-Cookie",
        `token=; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
      );
      return context.user;
    },
    createList: (
      _parent: object,
      { input }: { input: ListInput },
      context: Context
    ) => context.models.List.create(input),
    removeList: (_parent: object, { id }: { id: string }, context: Context) =>
      context.models.List.delete(id),
    updateList: (
      _parent: object,
      { input }: { input: ListEditInput },
      context: Context
    ) => context.models.List.update(input),
    likeList: (_parent: object, { id }: { id: string }, context: Context) =>
      context.models.List.like(id),
    createComment: async (
      _parent: object,
      { input }: { input: CommentInput },
      context: Context
    ) => context.models.Comment.create(input),
    createUser: (
      _parent: object,
      { input }: { input: UserInput },
      context: Context
    ) => context.models.User.create(input),
    followUser: (
      _parent: object,
      { username }: { username: string },
      context: Context
    ) => context.models.User.follow(username),
  },
};

export default new ApolloServer({
  typeDefs,
  resolvers,
  context: ({
    req,
    res,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
  }): Context => {
    const context = {
      res,
    };
    try {
      const { username } = jwt.verify(
        req.cookies.token,
        process.env.SECRET
      ) as any;
      const models = initModels(username);
      return {
        ...context,
        models,
        areListsLikedLoader: new DataLoader(models.List.areListsLiked),
        itemsLoader: new DataLoader(models.Item.getByListIds),
        user: username,
      };
    } catch {
      const models = initModels();
      return {
        ...context,
        models,
        itemsLoader: new DataLoader(models.Item.getByListIds),
      };
    }
  },
});
