import Layout from "../components/Layout";
import { Container } from "react-bootstrap";
import CreateForm, { CreateFormValues } from "../components/CreateForm";
import { useMutation } from "@apollo/client";
import {
  CREATE_LIST,
  ALL_LISTS,
  FRAGMENT_LIST_ALL_FIELDS,
} from "../lib/client/queries";
import { useRouter } from "next/router";
import { List } from "../lib/types";

const Create: React.FC = () => {
  const [createList] = useMutation<{ createList: List }>(CREATE_LIST, {
    update: (cache, { data: { createList } }) => {
      cache.modify({
        fields: {
          allLists: (existingListRefs = []) => {
            const newListRef = cache.writeFragment({
              data: createList,
              fragment: FRAGMENT_LIST_ALL_FIELDS,
            });
            return [...existingListRefs, newListRef];
          },
        },
      });
    },
  });

  const router = useRouter();

  const handleSubmit = async (input: CreateFormValues) => {
    await createList({
      variables: {
        input,
      },
    });
    router.push("/lists");
  };

  return (
    <Layout>
      <Container className="mt-3 text-container">
        <CreateForm handleSubmit={handleSubmit} />
      </Container>
    </Layout>
  );
};

export default Create;
