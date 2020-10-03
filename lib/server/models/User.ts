import { Follow, User, UserInput } from "../../types";
import { db } from "../db";
import { hash } from "bcrypt";
import { AuthenticationError, UserInputError } from "apollo-server-micro";

const createdAtString = (user: User): User => ({
  ...user,
  createdAt: (user.createdAt as Date).toISOString(),
});

const process = (user: User | unknown): User => createdAtString(user as User);

const userQuery = db("user").select([
  "user.*",
  db("follow")
    .count()
    .whereRaw('"user".username = follow.follows')
    .as("follower_count"),
  db("follow")
    .count()
    .whereRaw('"user".username = follow.username')
    .as("following_count"),
]);

export default (currUser: string = null) => ({
  getAll: async () => (await userQuery.clone()).map(process),

  getByUsername: async (username: string) => {
    const user = await userQuery.clone().first("*").where("username", username);
    return user && process(user);
  },

  create: async (input: UserInput) => {
    const { username, password } = input;
    try {
      const [result] = await db<User>("user").insert(
        {
          username,
          password: await hash(password, 10),
        },
        ["username", "createdAt"]
      );
      return createdAtString(result);
    } catch (error) {
      throw new UserInputError("Username already exists");
    }
  },

  follow: async (username: string) => {
    if (!currUser) {
      throw new AuthenticationError("Must be logged in");
    } else if (currUser === username) {
      throw new UserInputError("Cannot follow yourself");
    }

    const followInfo: Follow = { username: currUser, follows: username };
    const followEntry = await db<Follow>("follow").first().where(followInfo);
    if (!followEntry) {
      try {
        await db<Follow>("follow").insert(followInfo);
      } catch (error) {
        throw new UserInputError("User does not exist");
      }
    } else {
      await db("follow").del().where(followInfo);
    }

    const updatedUser = await userQuery
      .clone()
      .first()
      .where("username", username);
    return process(updatedUser);
  },

  isUserFollowed: async (username: string) => {
    if (!currUser) {
      return false;
    }

    return !!(await db<Follow>("follow")
      .first()
      .where({ username: currUser, follows: username }));
  },
});
