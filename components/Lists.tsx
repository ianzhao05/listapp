import { List } from "../lib/types";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import Link from "next/link";
import styles from "../styles/Lists.module.scss";
import { useRef, useEffect, useState } from "react";
import {
  BookmarkStar,
  BookmarkStarFill,
  ChatRightText,
} from "react-bootstrap-icons";

const ListCard: React.FC<{ data: List; showAuthor: boolean }> = ({
  data: list,
  showAuthor,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const [more, setMore] = useState(0);

  useEffect(() => {
    const itemNodes = Array.from(ulRef.current.children) as HTMLElement[];
    for (let node of itemNodes) {
      node.hidden = false;
    }
    const moreLink = itemNodes.pop();
    const cardRect = cardRef.current.getBoundingClientRect();
    let visible = 0;
    let lastVisible: HTMLElement = null;
    for (let item of itemNodes) {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.bottom > cardRect.bottom - 20) {
        item.hidden = true;
      } else {
        lastVisible = item;
        ++visible;
      }
    }
    if (visible === itemNodes.length) {
      moreLink.hidden = true;
    } else {
      if (lastVisible) {
        lastVisible.hidden = true;
        --visible;
      }
      setMore(itemNodes.length - visible);
    }
  }, [list, showAuthor]);

  const getTime = (createdAt: string) => {
    const time = formatDistanceToNowStrict(parseISO(createdAt), {
      addSuffix: true,
    });
    return time.startsWith("in ") ? "just now" : time;
  };

  return (
    <Col xs={12} sm={6} md={4} xl={3} className="mb-4">
      <Link href={`/lists/[id]`} as={`/lists/${list.id}`}>
        <Card className={styles.card}>
          <Card.Body ref={cardRef} className={styles.body}>
            <Card.Title className={styles.title}>{list.name}</Card.Title>
            {showAuthor && <Card.Subtitle>{list.author}</Card.Subtitle>}
            <Card.Text
              as="ul"
              ref={ulRef}
              className={`pl-1 ${styles.itemsList}`}
            >
              {list.items.map(({ content }, i) => (
                <li key={i} className="text-truncate">
                  {content}
                </li>
              ))}
              <p>{more} more items...</p>
            </Card.Text>
            <Card.Text className={styles.likes}>
              <small className="text-muted">
                {list.likedByUser ? (
                  <BookmarkStarFill color="darkturquoise" className="mr-1" />
                ) : (
                  <BookmarkStar className="mr-1" />
                )}
                {list.likes} <ChatRightText className="ml-1" />{" "}
                {list.commentCount}
              </small>
            </Card.Text>
            <Card.Text className={styles.time}>
              <small className="text-muted">
                {getTime(list.createdAt as string)}
              </small>
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

const Lists: React.FC<{ lists: List[]; showAuthor?: boolean }> = ({
  lists,
  showAuthor = true,
}) => {
  const [sortBy, setSortBy] = useState("recent");

  const sortLists = (lists: List[]): List[] => {
    switch (sortBy) {
      case "recent":
        return lists
          .slice(0)
          .sort((a, b) =>
            (b.createdAt as string).localeCompare(a.createdAt as string)
          );
      case "likes":
        return lists.slice(0).sort((a, b) => b.likes - a.likes);
      default:
        return lists;
    }
  };

  return (
    <>
      <Form inline className="mb-3">
        <Form.Group controlId="sortby">
          <Form.Label className="mr-1">Sort by:</Form.Label>
          <Form.Control
            as="select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
          >
            <option value="recent">Most recent</option>
            <option value="likes">Most likes</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <Container fluid>
        <Row>
          {sortLists(lists).map((list) => (
            <ListCard key={list.id} data={list} showAuthor={showAuthor} />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Lists;
