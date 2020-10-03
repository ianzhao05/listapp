import { Form, Button, Alert } from "react-bootstrap";
import { Formik } from "formik";
import { useState } from "react";

export interface LogInFormValues {
  username: string;
  password: string;
}
const initialValues: LogInFormValues = {
  username: "",
  password: "",
};

const LogInForm: React.FC<{
  handleSubmit: (input: LogInFormValues) => Promise<void>;
}> = ({ handleSubmit }) => {
  const [error, setError] = useState("");
  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors: { username?: string; password?: string } = {};
        if (!values.username) {
          errors.username = "Username required";
        }
        if (!values.password) {
          errors.password = "Password required";
        }
        return errors;
      }}
      onSubmit={async (values) => {
        try {
          await handleSubmit(values);
        } catch (error) {
          setError(error.message);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!(touched.username && errors.username)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!(touched.password && errors.password)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              className="d-block mx-auto w-50"
              type="submit"
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default LogInForm;
