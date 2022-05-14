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
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import { getAllSkillTypesFromPage } from "../api/calls/skillTypeCalls";
import { useState } from "react";
import SkillBadge from "./skillBadge";

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
    const { data: skillsRes, error: skillError } = useSWR(apiPaths.skillTypes, getAllSkillTypesFromPage);
    const router = useRouter();
    const values: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);
    const initalSkills: string[] = values.roles === "" ? [] : values.roles.split(" ");
    const [selectedSkills, setSelectedSkills] = useState<string[]>(initalSkills);
    let skills = skillsRes === undefined ? [] : skillsRes;

    if (skillError) {
        console.log(skillError);
        return null;
    }
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
                            values.roles = selectedSkills.join(" ");
                            console.log(values.roles)
                            await router.replace({
                                query: { ...router.query, ...fromFormStudentQueryParams(values) },
                            });
                        }}
                    >
                        {({ isSubmitting, setFieldValue }) => (
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
                                                        {skills.map((value) => (
                                                            <DropdownItem key={value.name} onClick={() => {
                                                                console.log("selectedSkills")
                                                                console.log(selectedSkills)
                                                                if (!selectedSkills.includes(value.name)) {
                                                                    setSelectedSkills([...selectedSkills, value.name]);
                                                                }
                                                            }}>{value.name}</DropdownItem>
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
                                                <input
                                                    type="hidden"
                                                    name="roles"
                                                    style={{ height: "100px" }}
                                                    id="skillFilter"
                                                    data-testid="template"
                                                    value={selectedSkills.join(" ")}
                                                    onChange={(event) => setFieldValue("roles", selectedSkills.join(" "))}
                                                />
                                                <div id="skillFilters">
                                                    {selectedSkills.map(skill => (<SkillBadge key={skill} skill={skill}/>))}
                                                </div>
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
