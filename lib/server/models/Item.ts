import { db, hashItemIds, hashListIds } from "../db";
import { Item } from "../../types";

const encodeItemId = (item: Item): Item => ({
  ...item,
  id: hashItemIds.encode(item.id as number),
});

export default (currUser: string = null) => ({
  getByListIds: async (ids: string[]) => {
    const decodedIds = ids.map((id) => hashListIds.decode(id)[0] as number);
    const listItems: { [id: number]: Item[] } = (
      await db.select(db.raw("json_object_agg(list_id, items)")).from(
        db("item")
          .select([
            "list_id",
            db.raw(
              "json_agg(json_build_object('id', id, 'content', content) order by \"order\") as items"
            ),
          ])
          .whereIn("list_id", decodedIds)
          .groupBy("list_id")
          .as("i")
      )
    )[0]["jsonObjectAgg"];
    return decodedIds.map((id) => listItems[id].map(encodeItemId));
  },
});
