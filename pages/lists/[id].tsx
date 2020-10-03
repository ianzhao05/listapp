import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Container, Spinner } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import {
  LIST_BY_ID,
  CURR_USER,
  REMOVE_LIST,
  ALL_LISTS,
  LIKE_LIST,
  CREATE_COMMENT,
} from "../../lib/client/queries";
import { List } from "../../lib/types";
import ListView from "../../components/ListView";

const ListPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading: listLoading, data: listData } = useQuery<{ listById: List }>(
    LIST_BY_ID,
    {
      variables: { id },
      skip: !id,
    }
  );
  const { loading: userLoading, data: userData } = useQuery<{
    currUser: string;
  }>(CURR_USER);
  const [removeList] = useMutation<{ removeList: List }>(REMOVE_LIST, {
    refetchQueries: [{ query: ALL_LISTS }],
  });
  const [likeList, { loading: likeLoading }] = useMutation(LIKE_LIST);
  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: LIST_BY_ID, variables: { id } }],
  });

  return (
    <Layout>
      <Container className="mt-3 text-container">
        {!id || listLoading || userLoading ? (
          <Spinner animation="border" />
        ) : !listData?.listById ? (
          <h3>List not found</h3>
        ) : (
          <ListView
            list={listData.listById}
            currUser={userData.currUser}
            remove={async () => {
              await removeList({ variables: { id: listData.listById.id } });
              router.push("/lists");
            }}
            like={async () => {
              if (!likeLoading) {
                await likeList({ variables: { id: listData.listById.id } });
              }
            }}
            comment={async (content: string) => {
              await createComment({
                variables: { input: { content, listId: listData.listById.id } },
              });
            }}
            likeLoading={likeLoading}
          />
        )}
      </Container>
    </Layout>
  );
};

export default ListPage;
