import {
  Follow,
  Item,
  ItemInput,
  List,
  ListEditInput,
  ListInput,
  ListLike,
} from "../../types";
import { db, hashItemIds, hashListIds } from "../db";
import { AuthenticationError, UserInputError } from "apollo-server-micro";

const encodeListId = (list: List): List => ({
  ...list,
  id: hashListIds.encode(list.id as number),
});

const createdAtString = (list: List): List => ({
  ...list,
  createdAt: (list.createdAt as Date).toISOString(),
});

const process = (list: List | unknown): List =>
  encodeListId(createdAtString(list as List));

const listQuery = db("list").select([
  "list.*",
  db("list_like").count().whereRaw("list.id = list_like.list_id").as("likes"),
  db("comment")
    .count()
    .whereRaw("list.id = comment.list_id")
    .as("comment_count"),
]);

export default (currUser: string = null) => ({
  getAll: async () =>
    (await listQuery.clone().orderBy("list.id", "desc")).map(process),

  getById: async (id: string) => {
    const decoded = hashListIds.decode(id)[0] as number;
    if (!decoded) {
      return null;
    }
    const list = await listQuery.clone().first().where("list.id", decoded);
    return list && process(list);
  },

  getByAuthor: async (user: string) =>
    (
      await listQuery
        .clone()
        .orderBy("list.id", "desc")
        .where("list.author", user)
    ).map(process),

  getLikedByUser: async (user: string) =>
    (
      await listQuery
        .clone()
        .innerJoin("list_like", "list.id", "list_like.list_id")
        .where("username", user)
        .orderBy("list.id", "desc")
    ).map(process),

  getFromFollowed: async () => {
    if (!currUser) {
      return [];
    }
    return (
      await listQuery
        .clone()
        .whereIn(
          "author",
          db<Follow>("follow").select("follows").where("username", currUser)
        )
        .orderBy("list.id", "desc")
    ).map(process);
  },

  create: async (input: ListInput) => {
    if (!currUser) {
      throw new AuthenticationError("Must be logged in");
    }
    if (input.items.length === 0) {
      throw new UserInputError("Must have items");
    }

    let listId: string | number;
    await db.transaction(async (trx) => {
      listId = (
        await trx<List>("list").insert(
          {
            name: input.name,
            author: currUser,
          },
          "id"
        )
      )[0];
      await trx<Item>("item").insert(
        input.items.map((item, index) => ({
          content: item.content,
          listId: listId as number,
          order: index,
        }))
      );
    });

    return process(await listQuery.clone().first().where("list.id", listId));
  },

  delete: async (id: string) => {
    if (!currUser) {
      throw new AuthenticationError("Must be logged in");
    }
    const decoded = hashListIds.decode(id)[0] as number;
    if (!decoded) {
      throw new UserInputError("List does not exist");
    }

    const list: any = await listQuery.clone().first().where("list.id", decoded);
    if (!list) {
      throw new UserInputError("List does not exist");
    } else if (list.author !== currUser) {
      throw new AuthenticationError("Must be author of list");
    }
    await db("list").del().where("id", decoded);
    return process(list);
  },

  update: async (input: ListEditInput) => {
    if (!currUser) {
      throw new AuthenticationError("Must be logged in");
    }
    if (input.items.length === 0) {
      throw new UserInputError("Must have items");
    }
    const decoded = hashListIds.decode(input.id)[0] as number;
    if (!decoded) {
      throw new UserInputError("List does not exist");
    }

    const list = await db<List>("list")
      .first("author")
      .where("list.id", decoded);
    if (!list) {
      throw new UserInputError("List does not exist");
    } else if (list.author !== currUser) {
      throw new AuthenticationError("Must be author of list");
    }
    await db.transaction(async (trx) => {
      await Promise.all(
        input.items.map(async ({ id, content }, index) => {
          if (!id) {
            await trx<Item>("item").insert({
              content,
              listId: decoded,
              order: index,
            });
          }
          const itemId = hashItemIds.decode(id)[0] as number;
          if (itemId) {
            await trx<Item>("item")
              .update({ content, order: index })
              .where("id", itemId);
          }
        })
      );
      const deleteIds = input.deleted
        .map((id) => hashItemIds.decode(id)[0] as number)
        .filter((decoded) => decoded);
      if (deleteIds.length !== 0) {
        await trx("item").del().whereIn("id", deleteIds);
      }
    });

    const updatedList = await listQuery
      .clone()
      .first()
      .where("list.id", decoded);
    return process(updatedList);
  },

  like: async (id: string) => {
    if (!currUser) {
      throw new AuthenticationError("Must be logged in");
    }

    const decoded = hashListIds.decode(id)[0] as number;
    if (!decoded) {
      throw new UserInputError("List does not exist");
    }
    const likeInfo: ListLike = { listId: decoded, username: currUser };
    const likeEntry = await db<ListLike>("list_like").first().where(likeInfo);
    if (!likeEntry) {
      try {
        await db<ListLike>("list_like").insert(likeInfo);
      } catch (error) {
        throw new UserInputError("List does not exist");
      }
    } else {
      await db("list_like").del().where(likeInfo);
    }

    const updatedList = await listQuery
      .clone()
      .first()
      .where("list.id", decoded);
    return process(updatedList);
  },

  areListsLiked: async (ids: string[]) => {
    if (!currUser) {
      return ids.map(() => false);
    }
    const decodedIds = ids.map((id) => hashListIds.decode(id)[0] as number);

    const likes = (
      await db<ListLike>("list_like")
        .select()
        .whereIn("listId", decodedIds)
        .andWhere("username", currUser)
    ).map((like) => like.listId);

    return decodedIds.map((id) => likes.includes(id));
  },
});
