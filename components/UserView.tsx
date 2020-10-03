import { useState } from "react";
import { User } from "../lib/types";
import { format, parseISO } from "date-fns";
import Lists from "./Lists";
import { Button, Container, Nav } from "react-bootstrap";

type View = "lists" | "liked";

const UserView: React.FC<{
  user: User;
  currUser: string;
  follow: () => void;
  followLoading: boolean;
}> = ({ user, currUser, follow, followLoading }) => {
  const [view, setView] = useState<View>("lists");
  return (
    <div>
      <Container className="text-container">
        <div className="clearfix">
          <h2 className="float-left">{user.username}</h2>
          <div className="float-right">
            {currUser && currUser !== user.username && (
              <Button variant="light" onClick={follow} disabled={followLoading}>
                {user.followedByUser ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>
        <p>
          {user.followerCount} followers
          <br />
          {user.followingCount} following
          <br />
          Joined {format(parseISO(user.createdAt as string), "MMMM d, y")}
        </p>
      </Container>
      <Nav
        variant="tabs"
        className="justify-content-center mb-3"
        activeKey={view}
        onSelect={(eventKey: View) => {
          setView(eventKey);
        }}
      >
        <Nav.Item>
          <Nav.Link eventKey={"lists"}>Lists</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={"liked"}>Liked</Nav.Link>
        </Nav.Item>
      </Nav>
      {user.lists.length > 0 ? (
        <Lists
          lists={
            view === "lists"
              ? user.lists
              : view === "liked"
              ? user.likedLists
              : []
          }
          showAuthor={view !== "lists"}
        />
      ) : (
        <p>This user does not have any lists yet</p>
      )}
    </div>
  );
};

export default UserView;
