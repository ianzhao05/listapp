import Head from "next/head";
import NavBar from "./NavBar";

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Listeroo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
