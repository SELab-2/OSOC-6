import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { ParsedUrlQueryInput } from "querystring";

interface IFormValues {
    freeText: string;
    roles: string;
    studentCoach: boolean;
    alumni: boolean;
    unmatched: boolean;
}

function boolToString(bool: boolean | undefined) {
    return bool ? "true" : "false";
}

function fromFormQuery(query: ParsedUrlQueryInput): IFormValues {
    const values: IFormValues = {
        freeText: "",
        roles: "",
        studentCoach: false,
        alumni: false,
        unmatched: false,
    };
    values.freeText = (query.freeText || "") as string;
    values.roles = (query.roles || "") as string;
    if (query.studentCoach != undefined) {
        values.studentCoach = query.studentCoach != "false";
    }
    if (query.alumni != undefined) {
        values.alumni = query.alumni != "false";
    }
    if (query.unmatched != undefined) {
        values.unmatched = query.unmatched != "false";
    }
    return values;
}

function fromFormValues(values: IFormValues): ParsedUrlQueryInput {
    const queryObject: ParsedUrlQueryInput = {};
    if (values.freeText) {
        queryObject.freeText = values.freeText;
    }
    if (values.roles) {
        queryObject.roles = values.roles;
    }
    if (values.studentCoach) {
        queryObject.studentCoach = boolToString(values.studentCoach);
    }
    if (values.alumni) {
        queryObject.alumni = boolToString(values.alumni);
    }
    if (values.unmatched) {
        queryObject.unmatched = boolToString(values.unmatched);
    }
    return queryObject;
}

export function StudentFilterComponent() {
    const router = useRouter();

    const values: IFormValues = fromFormQuery(router.query);
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={values}
                onSubmit={async (values) => {
                    await router.replace({
                        query: fromFormValues(values),
                    });
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-check">
                            <Field
                                type="checkbox"
                                className="form-check-input"
                                name="studentCoach"
                                id="coachCheck"
                            />
                            <label className="form-check-label" htmlFor="coachCheck">
                                Student Coach
                            </label>
                        </div>
                        <div className="form-check">
                            <Field
                                type="checkbox"
                                className="form-check-input"
                                name="alumni"
                                id="alumniCheck"
                            />
                            <label className="form-check-label" htmlFor="alumniCheck">
                                Alumni
                            </label>
                        </div>
                        <div className="form-check">
                            <Field
                                type="checkbox"
                                className="form-check-input"
                                name="unmatched"
                                id="unmatchedCheck"
                            />
                            <label className="form-check-label" htmlFor="unmatchedCheck">
                                Unmatched
                            </label>
                        </div>
                        <Field type="text" name="freeText" placeholder="Search students with key words" />
                        <Field type="text" name="roles" placeholder="Search students with roles" />
                        <button type="submit" disabled={isSubmitting}>
                            Apply filters
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    );
}
