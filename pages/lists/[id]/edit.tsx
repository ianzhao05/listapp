import { useRouter } from "next/router";
import CreateForm, { CreateFormValues } from "../../../components/CreateForm";
import { useQuery, useMutation } from "@apollo/client";
import {
  LIST_BY_ID,
  UPDATE_LIST,
  ALL_LISTS,
} from "../../../lib/client/queries";
import { ItemInput, List } from "../../../lib/types";
import Layout from "../../../components/Layout";
import { Container, Spinner } from "react-bootstrap";

const Edit: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, data } = useQuery<{ listById: List }>(LIST_BY_ID, {
    variables: { id },
    skip: !id,
  });
  const [updateList] = useMutation<{ updateList: List }>(UPDATE_LIST);

  const handleSubmit = async (input: CreateFormValues, deleted: string[]) => {
    await updateList({
      variables: {
        input: {
          id,
          items: input.items.map(({ id, content }) => ({ id, content })),
          deleted,
        },
      },
    });
    router.push("/lists/[id]", `/lists/${id}`);
  };

  return (
    <Layout>
      <Container className="mt-3 text-container">
        {!id || loading ? (
          <Spinner animation="border" />
        ) : !data?.listById ? (
          <h3>List not found</h3>
        ) : (
          <CreateForm
            handleSubmit={handleSubmit}
            formValues={{
              name: data.listById.name,
              items: data.listById.items as ItemInput[],
            }}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Edit;
