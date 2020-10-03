import { AuthenticationError, UserInputError } from "apollo-server-micro";
import { Comment, CommentInput } from "../../types";
import { db, hashListIds, hashCommentIds } from "../db";

const encodeCommentId = (comment: Comment) => ({
  ...comment,
  id: hashCommentIds.encode(comment.id as number),
});

const createdAtString = (comment: Comment): Comment => ({
  ...comment,
  createdAt: (comment.createdAt as Date).toISOString(),
});

const process = (comment: Comment) => encodeCommentId(createdAtString(comment));

export default (currUser: string = null) => ({
  getByListId: async (id: string) => {
    const listId = hashListIds.decode(id)[0] as number;
    return (await db<Comment>("comment").select().where("listId", listId)).map(
      process
    );
  },
  create: async (input: CommentInput) => {
    if (!currUser) {
      throw new AuthenticationError("Must be logged in");
    }
    const listId = hashListIds.decode(input.listId)[0] as number;
    if (!listId) {
      console.log(listId, input.listId);
      throw new UserInputError("Invalid list");
    }
    try {
      const comment = (
        await db<Comment>("comment").insert(
          {
            content: input.content,
            listId,
            author: currUser,
          },
          "*"
        )
      )[0];
      return process(comment);
    } catch {
      throw new UserInputError("Invalid list");
    }
  },
});
