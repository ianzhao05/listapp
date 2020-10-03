import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

export default new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allLists: {
            merge: (_existing, incoming) => incoming,
          },
        },
      },
      List: {
        fields: {
          items: {
            merge: (_existing, incoming) => incoming,
          },
        },
      },
      User: {
        keyFields: ["username"],
      },
    },
  }),
  link: createHttpLink({
    uri: "/api/graphql",
    credentials: "same-origin",
  }),
});
