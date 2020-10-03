import List from "./List";
import User from "./User";
import Item from "./Item";
import Comment from "./Comment";

export interface Models {
  List: ReturnType<typeof List>;
  User: ReturnType<typeof User>;
  Item: ReturnType<typeof Item>;
  Comment: ReturnType<typeof Comment>;
}

export const initModels = (currUser: string = null): Models => ({
  List: List(currUser),
  User: User(currUser),
  Item: Item(currUser),
  Comment: Comment(currUser),
});
