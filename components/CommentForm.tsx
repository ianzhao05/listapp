import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";

export interface CommentFormValues {
  content: string;
}

const initialValues: CommentFormValues = {
  content: "",
};

const CommentForm: React.FC<{
  handleSubmit: (input: CommentFormValues) => Promise<void>;
}> = ({ handleSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => (values.content ? {} : { content: "Required" })}
      onSubmit={async (values, actions) => {
        await handleSubmit(values);
        actions.resetForm();
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
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mr-2">
            <Form.Label srOnly>Comment</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              placeholder="Comment"
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!(touched.content && errors.content)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content}
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" variant="light" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CommentForm;
