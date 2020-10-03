import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { CURR_USER, LOGOUT } from "../lib/client/queries";
import { useRouter } from "next/router";

const NavBar: React.FC = () => {
  const { data } = useQuery<{ currUser: string }>(CURR_USER);
  const [logout, { client }] = useMutation(LOGOUT, {
    onCompleted: () => {
      client.resetStore();
    },
    ignoreResults: true,
  });
  const router = useRouter();
  const redirect = router.asPath;

  return (
    <Navbar
      collapseOnSelect
      bg="light"
      variant="light"
      expand="sm"
      sticky="top"
    >
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>
            <img src="/logo.svg" style={{ height: "1.5em" }} /> Listeroo
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Link href="/lists" passHref>
              <Nav.Link>Explore</Nav.Link>
            </Link>
            {data?.currUser && (
              <Link href="/create" passHref>
                <Nav.Link>New List</Nav.Link>
              </Link>
            )}
          </Nav>
          {data?.currUser ? (
            <>
              <Navbar.Text className="mr-2">
                Welcome{" "}
                <span className="font-weight-bold">{data.currUser}</span>
              </Navbar.Text>{" "}
              <Nav>
                <Link
                  href={`/users/[name]`}
                  as={`/users/${data.currUser}`}
                  passHref
                >
                  <Nav.Link>Profile</Nav.Link>
                </Link>
                <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
              </Nav>
            </>
          ) : (
            <>
              <Nav className="mr-2">
                <Link
                  href={{ pathname: "/login", query: { redirect } }}
                  passHref
                >
                  <Nav.Link>Sign In</Nav.Link>
                </Link>
              </Nav>
              <Link href="/register" passHref>
                <Button variant="outline-secondary">Register</Button>
              </Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
