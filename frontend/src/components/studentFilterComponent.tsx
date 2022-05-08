import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { ParsedUrlQueryInput } from "querystring";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../utility/stringUtil";
import { IStudentQueryParams } from "../api/calls/studentCalls";
import { Row, Col, ButtonGroup, Dropdown } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import Image from "next/image";

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
        status: "",
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
    values.status = (query.status || "") as string;
    console.log(values);
    return values;
}

function fromFormStudentQueryParams(values: IStudentQueryParams): ParsedUrlQueryInput {
    const queryObject: ParsedUrlQueryInput = {};
    queryObject.freeText = values.freeText;
    queryObject.roles = values.roles;
    queryObject.studentCoach = boolToString(values.studentCoach);
    queryObject.alumni = boolToString(values.alumni);
    queryObject.unmatched = boolToString(values.unmatched);
    queryObject.status = "";
    return queryObject;
}

export function StudentFilterComponent() {
    const { t } = useTranslation("common");

    const router = useRouter();

    const values: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);
    return (
        <div data-testid="student-filter" style={{ backgroundColor: "#0a0839" }}>
            <div style={{ color: "white", padding: 20 }}>
                <Row>
                    <h1>Filters</h1>
                </Row>

                <Row style={{ paddingLeft: 20 }}>
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
                                <Row>
                                    <Col sm={3}>
                                        <div className="form-check">
                                            <Field
                                                type="checkbox"
                                                className="form-check-input"
                                                name="studentCoach"
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
                                                id="unmatchedCheck"
                                            />
                                            <label className="form-check-label" htmlFor="unmatchedCheck">
                                                {capitalize(t("unmatched"))}
                                            </label>
                                        </div>
                                    </Col>
                                    <Col sm={9}>
                                        <Row>
                                            <Col
                                                sm={4}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div>Roles</div>
                                                <Dropdown as={ButtonGroup} drop="down">
                                                    <Dropdown.Toggle
                                                        style={{
                                                            backgroundColor: "#0a0839",
                                                            borderColor: "white",
                                                            height: 30,
                                                            alignItems: "center",
                                                            display: "flex",
                                                        }}
                                                    >
                                                        Choose one or more
                                                    </Dropdown.Toggle>
                                                    <DropdownMenu>
                                                        {["Marketing", "Communication"].map((value) => (
                                                            <DropdownItem key={value}>{value}</DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>
                                            <Col sm={8}>
                                                <Field
                                                    type="text"
                                                    name="freeText"
                                                    className="textfield"
                                                    style={{
                                                        backgroundColor: "#0a0839",
                                                        borderColor: "white",
                                                        borderWidth: 1,
                                                        color: "white",
                                                        width: 400,
                                                        paddingLeft: 10,
                                                    }}
                                                    placeholder="Search students with keywords"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Image
                                                                alt={capitalize(t("edit"))}
                                                                src={"/resources/edit.svg"}
                                                                width="15"
                                                                height="15"
                                                            />
                                                        ),
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={8}>
                                                <p>Marketing</p>
                                            </Col>
                                        </Row>
                                        <Row style={{ flexDirection: "row-reverse", paddingRight: 10 }}>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                style={{
                                                    width: 100,
                                                    color: "white",
                                                    height: 25,
                                                    alignItems: "center",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    borderColor: "white",
                                                    backgroundColor: "#0a0839",
                                                }}
                                            >
                                                {capitalize(t("apply"))}
                                            </button>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Row>
            </div>
        </div>
    );
}
