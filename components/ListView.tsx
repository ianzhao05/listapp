import { List } from "../lib/types";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import styles from "../styles/ListView.module.scss";
import { useRouter } from "next/router";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import CommentForm from "./CommentForm";
import {
  BookmarkStar,
  BookmarkStarFill,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";

const ListView: React.FC<{
  list: List;
  currUser: string;
  remove: () => void;
  like: () => void;
  comment: (content: string) => Promise<void>;
  likeLoading: boolean;
}> = ({ list, currUser, remove, like, comment, likeLoading }) => {
  const isAuthor = currUser === list.author;
  const router = useRouter();
  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <h2>{list.name}</h2>
          <div className="clearfix">
            <Link href="/users/[name]" as={`/users/${list.author}`}>
              <h4 className={`${styles.link} float-left`}>{list.author}</h4>
            </Link>
            <div className="float-right">
              <ButtonGroup aria-label="List controls">
                <Button
                  variant="light"
                  aria-label="Like"
                  disabled={!currUser || likeLoading}
                  onClick={like}
                >
                  {list.likedByUser ? (
                    <BookmarkStarFill color="darkturquoise" />
                  ) : (
                    <BookmarkStar />
                  )}{" "}
                  {list.likes}
                </Button>
                {isAuthor && (
                  <>
                    <Button
                      variant="light"
                      aria-label="Edit"
                      onClick={() => {
                        router.push(
                          "/lists/[id]/edit",
                          `/lists/${list.id}/edit`
                        );
                      }}
                    >
                      <PencilSquare />
                    </Button>
                    <Button
                      variant="light"
                      aria-label="Delete"
                      onClick={remove}
                    >
                      <Trash />
                    </Button>
                  </>
                )}
              </ButtonGroup>
            </div>
          </div>
          <ul>
            {list.items.map(({ id, content }) => (
              <li key={id} className={styles.listItem}>
                {content}
              </li>
            ))}
          </ul>
          <p>
            {format(parseISO(list.createdAt as string), "MMMM d, y, h:mm a")}
          </p>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <h4>Comments ({list.comments.length})</h4>
          {list.comments.length > 0 ? (
            <ul>
              {list.comments.map(({ id, content, author, createdAt }) => (
                <li key={id}>
                  <span className={styles.listItem}>{content}</span>
                  <br />
                  <Link href="/users/[name]" as={`/users/${author}`}>
                    <span className={styles.link}>{author}</span>
                  </Link>
                  , {format(parseISO(createdAt as string), "MMMM d, y, h:mm a")}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet!</p>
          )}
          {currUser ? (
            <CommentForm
              handleSubmit={async (input) => {
                await comment(input.content);
              }}
            />
          ) : (
            <p>Log in to comment</p>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ListView;
