import { Field, Form, Formik } from "formik";

export default function CommunicationTemplateCreate() {
    const initialValues = {
        name: "",
        template: "",
    };

    return (
        <div>
            <h1>Create communication template</h1>
            <Formik initialValues={initialValues} onSubmit={(values) => console.log(values)}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <label htmlFor="communicationTemplateNameField">Name:</label>
                        <Field type="text" name="name" required id="communicationTemplateNameField" />

                        <textarea
                            placeholder="Write your template here"
                            className="form-control"
                            style={{ height: "100px" }}
                            id="communicationTemplateTemplateField"
                            value={values.template}
                            onChange={(event) => setFieldValue("template", event.target.value)}
                        />

                        <button type="submit">submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
