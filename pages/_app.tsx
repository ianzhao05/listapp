import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../lib/client/apolloclient";
import "../styles/globals.scss";
import { resetServerContext } from "react-beautiful-dnd";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  resetServerContext();
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
