import { gql } from "@apollo/client";

export const CURR_USER = gql`
  query {
    currUser
  }
`;

export const LOGIN = gql`
  mutation LogIn($input: UserInput!) {
    login(input: $input)
  }
`;

export const LOGOUT = gql`
  mutation {
    logout
  }
`;

export const FRAGMENT_LIST_ALL_FIELDS = gql`
  fragment ListAllFields on List {
    id
    name
    author
    items {
      id
      content
    }
    createdAt
    likes
    likedByUser
    commentCount
  }
`;

export const ALL_LISTS = gql`
  query {
    allLists {
      ...ListAllFields
    }
  }
  ${FRAGMENT_LIST_ALL_FIELDS}
`;

export const ALL_LISTS_LIKES = gql`
  query {
    allLists {
      id
      likes
      likedByUser
    }
  }
`;

export const LIST_BY_ID = gql`
  query ListById($id: String!) {
    listById(id: $id) {
      ...ListAllFields
      comments {
        id
        content
        author
        createdAt
      }
    }
  }
  ${FRAGMENT_LIST_ALL_FIELDS}
`;

export const LISTS_FROM_FOLLOWED = gql`
  query {
    listsFromFollowed {
      ...ListAllFields
    }
  }
  ${FRAGMENT_LIST_ALL_FIELDS}
`;

export const USER_BY_NAME = gql`
  query UserByName($username: String!) {
    userByName(username: $username) {
      username
      createdAt
      lists {
        ...ListAllFields
      }
      likedLists {
        ...ListAllFields
      }
      followerCount
      followingCount
      followedByUser
    }
  }
  ${FRAGMENT_LIST_ALL_FIELDS}
`;

export const CREATE_LIST = gql`
  mutation CreateList($input: ListInput!) {
    createList(input: $input) {
      ...ListAllFields
    }
  }
  ${FRAGMENT_LIST_ALL_FIELDS}
`;

export const REMOVE_LIST = gql`
  mutation RemoveList($id: String!) {
    removeList(id: $id) {
      id
    }
  }
`;

export const UPDATE_LIST = gql`
  mutation UpdateList($input: ListEditInput!) {
    updateList(input: $input) {
      ...ListAllFields
    }
  }
  ${FRAGMENT_LIST_ALL_FIELDS}
`;

export const LIKE_LIST = gql`
  mutation LikeList($id: String!) {
    likeList(id: $id) {
      id
      likes
      likedByUser
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      id
      content
      author
      createdAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      username
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($username: String!) {
    followUser(username: $username) {
      username
      followerCount
      followedByUser
    }
  }
`;
