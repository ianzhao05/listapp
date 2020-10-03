import React from "react";
import Layout from "../components/Layout";
import LogInForm, { LogInFormValues } from "../components/LogInForm";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../lib/client/queries";

const LogIn = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const [login, { client }] = useMutation(LOGIN, {
    onCompleted: () => {
      client.resetStore();
    },
  });

  const handleSubmit = async (input: LogInFormValues) => {
    await login({ variables: { input } });
    router.push((redirect as string) || "/lists");
  };

  return (
    <Layout>
      <Container className="text-container mt-3">
        <LogInForm handleSubmit={handleSubmit} />
      </Container>
    </Layout>
  );
};

export default LogIn;
