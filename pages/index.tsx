import Layout from "../components/Layout";
import { Jumbotron, Container, Button } from "react-bootstrap";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <Layout>
      <Jumbotron fluid>
        <Container>
          <h1 className="font-weight-bold">Listeroo</h1>

          <ul style={{ fontSize: "1.5em" }}>
            <li>Create and revise</li>
            <li>Comment, like, and follow</li>
            <li>Have fun!</li>
          </ul>

          <Link href="/lists" passHref>
            <Button size="lg" variant="primary">
              Explore Lists
            </Button>
          </Link>
        </Container>
      </Jumbotron>
    </Layout>
  );
};

export default Home;
