import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { ParsedUrlQueryInput } from "querystring";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { IStudentQueryParams } from "../../api/calls/studentCalls";

function boolToString(bool: boolean | undefined) {
    return bool ? "true" : "false";
}

export function getStudentQueryParamsFromQuery(query: ParsedUrlQueryInput): IStudentQueryParams {
    const values: IStudentQueryParams = {
        freeText: "",
        roles: "",
        studentCoach: false,
        alumni: false,
        unmatched: false,
    };
    values.freeText = (query.freeText || "") as string;
    values.roles = (query.roles || "") as string;
    if (query.studentCoach !== undefined) {
        values.studentCoach = query.studentCoach !== "false";
    }
    if (query.alumni !== undefined) {
        values.alumni = query.alumni !== "false";
    }
    if (query.unmatched !== undefined) {
        values.unmatched = query.unmatched !== "false";
    }
    return values;
}

function fromFormStudentQueryParams(values: IStudentQueryParams): ParsedUrlQueryInput {
    const queryObject: ParsedUrlQueryInput = {};
    queryObject.freeText = values.freeText;
    queryObject.roles = values.roles;
    queryObject.studentCoach = boolToString(values.studentCoach);
    queryObject.alumni = boolToString(values.alumni);
    queryObject.unmatched = boolToString(values.unmatched);
    return queryObject;
}

export function StudentFilterComponent() {
    const { t } = useTranslation("common");

    const router = useRouter();

    const values: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);
    return (
        <div data-testid="student-filter">
            <Formik
                enableReinitialize={true}
                initialValues={values}
                onSubmit={async (values) => {
                    await router.replace({
                        query: { ...router.query, ...fromFormStudentQueryParams(values) },
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
                                data-testid="coachCheck"
                                id="coachCheck"
                            />
                            <label className="form-check-label" htmlFor="coachCheck">
                                {capitalize(t("student coach"))}
                            </label>
                        </div>
                        <div className="form-check">
                            <Field
                                type="checkbox"
                                className="form-check-input"
                                name="alumni"
                                data-testid="alumniCheck"
                                id="alumniCheck"
                            />
                            <label className="form-check-label" htmlFor="alumniCheck">
                                {capitalize(t("alumni"))}
                            </label>
                        </div>
                        <div className="form-check">
                            <Field
                                type="checkbox"
                                className="form-check-input"
                                name="unmatched"
                                data-testid="unmatchedCheck"
                                id="unmatchedCheck"
                            />
                            <label className="form-check-label" htmlFor="unmatchedCheck">
                                {capitalize(t("unmatched"))}
                            </label>
                        </div>
                        <Field
                            type="text"
                            name="freeText"
                            placeholder="Search students with key words"
                            data-testid="freeText"
                        />
                        <Field
                            type="text"
                            name="roles"
                            placeholder="Search students with roles"
                            data-testid="roles"
                        />
                        <button type="submit" disabled={isSubmitting} data-testid="submit">
                            {capitalize(t("apply"))}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
