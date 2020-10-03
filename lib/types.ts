export interface Item {
  id: number | string;
  content: string;
  listId: number;
  order: number;
}

export interface ItemInput {
  id?: string;
  content: string;
  listId?: number;
  order?: number;
}

export interface List {
  id: number | string;
  name: string;
  author: string;
  items: Item[];
  comments: Comment[];
  commentCount: number;
  likes: number;
  createdAt: Date | string;
  likedByUser: boolean;
}

export interface ListInput {
  name: string;
  items: ItemInput[];
}

export interface ListEditInput {
  id: string;
  items: ItemInput[];
  deleted: string[];
}

export interface Comment {
  id: number | string;
  content: string;
  author: string;
  listId: number | string;
  createdAt: Date | string;
}

export interface CommentInput {
  content: string;
  listId: string;
}

export interface User {
  username: string;
  password: string;
  createdAt: Date | string;
  lists: List[];
  likedLists: List[];
  followerCount: number;
  followingCount: number;
  followedByUser: boolean;
}

export interface UserInput {
  username: string;
  password: string;
}

export interface ListLike {
  listId: number;
  username: string;
}

export interface Follow {
  username: string;
  follows: string;
}
