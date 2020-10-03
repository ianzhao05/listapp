import Layout from "../components/Layout";
import Lists from "../components/Lists";
import { useQuery } from "@apollo/client";
import {
  ALL_LISTS,
  CURR_USER,
  LISTS_FROM_FOLLOWED,
} from "../lib/client/queries";
import { Container, Spinner, Nav } from "react-bootstrap";
import { List } from "../lib/types";
import { useEffect, useState } from "react";

type View = "all" | "fromFollowed";

const ListsPage = () => {
  const { loading: allListsLoading, data: allListsData } = useQuery<{
    allLists: List[];
  }>(ALL_LISTS);
  const { loading: userLoading, data: userData } = useQuery<{
    currUser: string;
  }>(CURR_USER);
  const { loading: fromFollowedLoading, data: fromFollowedData } = useQuery<{
    listsFromFollowed: List[];
  }>(LISTS_FROM_FOLLOWED);
  const [view, setView] = useState<View>("all");

  useEffect(() => {
    if (!userData?.currUser) {
      setView("all");
    }
  }, [userData?.currUser]);

  return (
    <Layout>
      <Container className="mt-3">
        <Nav
          variant="tabs"
          className="justify-content-center mb-3"
          activeKey={view}
          onSelect={(eventKey: View) => {
            setView(eventKey);
          }}
        >
          <Nav.Item>
            <Nav.Link eventKey={"all"}>All Lists</Nav.Link>
          </Nav.Item>
          {!userLoading && userData.currUser && (
            <Nav.Item>
              <Nav.Link eventKey={"fromFollowed"}>
                From Users You Follow
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>
        {view === "all" ? (
          allListsLoading ? (
            <Spinner animation="border" />
          ) : allListsData.allLists.length > 0 ? (
            <Lists lists={allListsData.allLists} />
          ) : (
            <p>No lists yet!</p>
          )
        ) : view === "fromFollowed" ? (
          fromFollowedLoading ? (
            <Spinner animation="border" />
          ) : fromFollowedData.listsFromFollowed.length > 0 ? (
            <Lists lists={fromFollowedData.listsFromFollowed} />
          ) : (
            <p>No lists from users you follow!</p>
          )
        ) : null}
      </Container>
    </Layout>
  );
};

export default ListsPage;
