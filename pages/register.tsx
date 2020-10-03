import React from "react";
import Layout from "../components/Layout";
import RegisterForm, { RegisterFormValues } from "../components/RegisterForm";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../lib/client/queries";

const Register = () => {
  const router = useRouter();
  const [createUser] = useMutation(CREATE_USER);

  const handleSubmit = async (input: RegisterFormValues) => {
    await createUser({
      variables: {
        input: { username: input.username, password: input.confirmPassword },
      },
    });
    router.push("/login");
  };

  return (
    <Layout>
      <Container className="text-container mt-3">
        <RegisterForm handleSubmit={handleSubmit} />
      </Container>
    </Layout>
  );
};

export default Register;
