import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";

export interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}
const initialValues: RegisterFormValues = {
  username: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm: React.FC<{
  handleSubmit: (input: RegisterFormValues) => Promise<void>;
}> = ({ handleSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors: {
          username?: string;
          password?: string;
          confirmPassword?: string;
        } = {};
        if (!values.username) {
          errors.username = "Username required";
        }
        if (!values.password) {
          errors.password = "Password required";
        }
        if (values.confirmPassword !== values.password) {
          errors.confirmPassword = "Passwords must match";
        }
        return errors;
      }}
      onSubmit={async (values, actions) => {
        try {
          await handleSubmit(values);
        } catch (error) {
          actions.setFieldError("username", error.message);
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
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={
                  !!(touched.confirmPassword && errors.confirmPassword)
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              className="d-block mx-auto w-50"
              type="submit"
              disabled={isSubmitting}
            >
              Create Account
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default RegisterForm;
