import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { ParsedUrlQueryInput } from "querystring";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { IStudentQueryParams } from "../../api/calls/studentCalls";
import { ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import Image from "next/image";
import useSWR from "swr";
import { getAllSkillTypesFromPage } from "../../api/calls/skillTypeCalls";
import { useState } from "react";
import SkillBadge from "../util/skillBadge";
import apiPaths from "../../properties/apiPaths";
import { useRouterReplace } from "../../hooks/routerHooks";

function boolToString(bool: boolean | undefined) {
    return bool ? "true" : "false";
}

export function getStudentQueryParamsFromQuery(query: ParsedUrlQueryInput): IStudentQueryParams {
    const values: IStudentQueryParams = {
        freeText: "",
        skills: [],
        studentCoach: false,
        alumni: false,
        unmatched: false,
        status: "",
    };
    values.freeText = (query.freeText || "") as string;
    if (query.skills) {
        // If skills has only 1 element it will be interpreted as a string instead of a list
        if (typeof query.skills == "string") {
            values.skills = [query.skills];
        } else {
            values.skills = query.skills as string[];
        }
    }
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
    return values;
}

function fromFormStudentQueryParams(values: IStudentQueryParams): ParsedUrlQueryInput {
    const queryObject: ParsedUrlQueryInput = {};
    queryObject.freeText = values.freeText;
    queryObject.skills = values.skills;
    queryObject.studentCoach = boolToString(values.studentCoach);
    queryObject.alumni = boolToString(values.alumni);
    queryObject.unmatched = boolToString(values.unmatched);
    queryObject.status = "";
    return queryObject;
}

export function StudentFilterComponent() {
    const { t } = useTranslation("common");
    const { data: receivedSkills, error: skillError } = useSWR(apiPaths.skillTypes, getAllSkillTypesFromPage);
    const router = useRouter();
    const routerAction = useRouterReplace();
    const values: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(values.skills);
    let skills = receivedSkills || [];

    if (skillError) {
        console.log(skillError);
        return null;
    }
    return (
        <div data-testid="student-filter" style={{ backgroundColor: "#0a0839" }}>
            <div style={{ color: "white", padding: 20 }}>
                <Row>
                    <h1>{capitalize(t("filters"))}</h1>
                </Row>

                <Row style={{ paddingLeft: 20 }}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={values}
                        onSubmit={async (values) => {
                            values.skills = selectedSkills;
                            await routerAction({
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
                                                <div>{capitalize(t("skills"))}</div>
                                                <Dropdown as={ButtonGroup} drop="down">
                                                    <Dropdown.Toggle
                                                        style={{
                                                            backgroundColor: "#0a0839",
                                                            borderColor: "white",
                                                            height: 30,
                                                            alignItems: "center",
                                                            display: "flex",
                                                        }}
                                                        data-testid="skill-dropdown"
                                                    >
                                                        {capitalize(t("choose roles"))}
                                                    </Dropdown.Toggle>
                                                    <DropdownMenu>
                                                        {skills.map((value) => (
                                                            <DropdownItem
                                                                key={value.name}
                                                                data-testid={"select-option-" + value.name}
                                                                onClick={() => {
                                                                    if (
                                                                        !selectedSkills.includes(value.name)
                                                                    ) {
                                                                        setSelectedSkills([
                                                                            ...selectedSkills,
                                                                            value.name,
                                                                        ]);
                                                                    }
                                                                }}
                                                            >
                                                                {value.name}
                                                            </DropdownItem>
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
                                                    data-testid="freeText"
                                                    placeholder="Search students with keywords"
                                                    initprops={{
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
                                                <div data-testid="roles">
                                                    {selectedSkills.map((skill) => (
                                                        <SkillBadge
                                                            data-testid={"skillbadge-" + skill}
                                                            key={skill}
                                                            skill={skill}
                                                            onClick={() =>
                                                                setSelectedSkills(
                                                                    selectedSkills.filter(
                                                                        (selected) => selected !== skill
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    ))}
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
                                                data-testid="submit"
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
