import { Form, InputGroup, Button, Alert } from "react-bootstrap";
import styles from "../styles/CreateForm.module.scss";
import { Formik, FieldArray } from "formik";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useRef, useState } from "react";
import { ItemInput } from "../lib/types";

export interface CreateFormValues {
  name: string;
  items: ItemInput[];
}
const initialValues: CreateFormValues = {
  name: "",
  items: Array.from(Array(3), () => ({ content: "" })),
};

const CreateForm: React.FC<{
  handleSubmit: (input: CreateFormValues, deleted?: string[]) => Promise<void>;
  formValues?: CreateFormValues;
}> = ({ handleSubmit, formValues }) => {
  const itemsRef = useRef([]);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState<string[]>([]);

  return (
    <Formik
      initialValues={formValues || initialValues}
      validate={(values) => {
        const errors: { name?: string; items?: string } = {};
        if (values.name.trim() === "") {
          errors.name = "Required";
        }
        if (values.items.every(({ content }) => !content.trim())) {
          errors.items = "Required";
        }
        return errors;
      }}
      onSubmit={async (values, actions) => {
        try {
          if (formValues) {
            await handleSubmit(
              {
                name: values.name,
                items: values.items.filter(({ content }) => content.trim()),
              },
              deleted
            );
          } else {
            await handleSubmit({
              name: values.name,
              items: values.items.filter(({ content }) => content.trim()),
            });
          }
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
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="My Awesome List"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!!formValues}
                isInvalid={!!(touched.name && errors.name)}
              />
              <Form.Control.Feedback type="invalid">
                Give your list a name!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Items</Form.Label>
              {!formValues && (
                <Form.Text muted className="mb-3">
                  New items will be added automatically, or use the "New Item"
                  button. Remove items with their &#x2715; button. Reorder items
                  by dragging and dropping their bullet.
                </Form.Text>
              )}
              <FieldArray name="items">
                {(arrayHelpers) => (
                  <>
                    <DragDropContext
                      onDragStart={(start) => {
                        itemsRef.current[start.source.index].focus();
                      }}
                      onDragEnd={(result) => {
                        const { source, destination } = result;
                        itemsRef.current[source.index].blur();
                        if (!destination) {
                          return;
                        }
                        arrayHelpers.move(source.index, destination.index);
                      }}
                    >
                      <Droppable droppableId="droppable">
                        {(providedDrop) => (
                          <div
                            ref={providedDrop.innerRef}
                            {...providedDrop.droppableProps}
                          >
                            {values.items.map((item, idx) => (
                              <Draggable
                                key={idx}
                                draggableId={idx.toString()}
                                index={idx}
                              >
                                {(providedDrag) => (
                                  <div
                                    ref={providedDrag.innerRef}
                                    {...providedDrag.draggableProps}
                                    className="d-flex align-items-center mb-2"
                                  >
                                    <div
                                      {...providedDrag.dragHandleProps}
                                      className="p-2"
                                      ref={(el) => {
                                        itemsRef.current[idx] = el;
                                      }}
                                    >
                                      &#x2022;
                                    </div>
                                    <InputGroup className="flex-grow-1">
                                      <Form.Control
                                        type="text"
                                        name={`items[${idx}].content`}
                                        value={item.content}
                                        onChange={(...args) => {
                                          if (idx === values.items.length - 1) {
                                            arrayHelpers.push({ content: "" });
                                          }
                                          handleChange(...args);
                                        }}
                                        onBlur={handleBlur}
                                        className={
                                          item.content.trim()
                                            ? ""
                                            : styles.emptyInput
                                        }
                                      />
                                      {values.items.length > 1 && (
                                        <InputGroup.Append>
                                          <Button
                                            variant="outline-danger"
                                            onClick={() => {
                                              arrayHelpers.remove(idx);
                                              const removedId = item.id;
                                              if (removedId) {
                                                setDeleted(
                                                  deleted.concat(removedId)
                                                );
                                              }
                                            }}
                                          >
                                            &#x2715;
                                          </Button>
                                        </InputGroup.Append>
                                      )}
                                    </InputGroup>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {providedDrop.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    <div className="d-flex align-items-center">
                      <div className="p-2">&#x2022;</div>
                      <Button
                        variant="secondary"
                        onClick={() => arrayHelpers.push({ content: "" })}
                      >
                        New Item
                      </Button>
                    </div>
                  </>
                )}
              </FieldArray>
              {touched.items &&
                errors.items &&
                values.items.every(({ content }) => !content.trim()) && (
                  <div className="text-danger">
                    <small>Add some items!</small>
                  </div>
                )}
            </Form.Group>
            <Button
              className="d-block mx-auto w-50"
              type="submit"
              disabled={isSubmitting}
            >
              {formValues ? "Save" : "Create!"}
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default CreateForm;
