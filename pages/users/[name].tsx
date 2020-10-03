import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Container, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import {
  CURR_USER,
  FOLLOW_USER,
  LISTS_FROM_FOLLOWED,
  USER_BY_NAME,
} from "../../lib/client/queries";
import { User } from "../../lib/types";
import UserView from "../../components/UserView";

const UserPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const { loading: currUserLoading, data: userData } = useQuery<{
    currUser: string;
  }>(CURR_USER);
  const { loading: userLoading, data } = useQuery<{ userByName: User }>(
    USER_BY_NAME,
    {
      variables: { username: name },
      skip: !name,
    }
  );
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    refetchQueries: [{ query: LISTS_FROM_FOLLOWED }],
  });

  return (
    <Layout>
      <Container className="mt-3">
        {!name || userLoading || currUserLoading ? (
          <Spinner animation="border" />
        ) : !data?.userByName ? (
          <h3>User not found</h3>
        ) : (
          <UserView
            user={data.userByName}
            currUser={userData.currUser}
            follow={async () => {
              if (!followLoading) {
                await followUser({
                  variables: { username: data.userByName.username },
                });
              }
            }}
            followLoading={followLoading}
          />
        )}
      </Container>
    </Layout>
  );
};

export default UserPage;
