import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { ParsedUrlQueryInput } from "querystring";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { IStudentQueryParams } from "../../api/calls/studentCalls";
import { Button, ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import Image from "next/image";
import useSWR from "swr";
import { getAllSkillTypesFromPage } from "../../api/calls/skillTypeCalls";
import { useState } from "react";
import SkillBadge from "../util/skillBadge";
import apiPaths from "../../properties/apiPaths";
import styles from "../../styles/studentFilter.module.css";

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
    const values: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(values.skills);
    let skills = receivedSkills || [];

    if (skillError) {
        console.log(skillError);
        return null;
    }
    return (
        <div data-testid="student-filter" className={styles.student_filter_div}>
            <div className={styles.filter_data_holder}>
                <h1>{capitalize(t("filters"))}</h1>
                <div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={values}
                        onSubmit={async (values) => {
                            values.skills = selectedSkills;
                            await router.replace({
                                query: { ...router.query, ...fromFormStudentQueryParams(values) },
                            });
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className={styles.filter_filters_div}>
                                    <div className={styles.filter_checkboxes_div}>
                                        <div className="form-check">
                                            <Field
                                                type="checkbox"
                                                className={"form-check-input"}
                                                name="studentCoach"
                                                data-testid="coachCheck"
                                                id="coachCheck"
                                            />
                                            <label
                                                className={"form-check-label " + styles.filter_fields}
                                                htmlFor="coachCheck"
                                            >
                                                {capitalize(t("student coach"))}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <Field
                                                type="checkbox"
                                                className={"form-check-input"}
                                                name="alumni"
                                                data-testid="alumniCheck"
                                                id="alumniCheck"
                                            />
                                            <label
                                                className={"form-check-label " + styles.filter_fields}
                                                htmlFor="coachCheck"
                                            >
                                                {capitalize(t("alumni"))}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <Field
                                                type="checkbox"
                                                className={"form-check-input"}
                                                name="unmatched"
                                                data-testid="unmatchedCheck"
                                                id="unmatchedCheck"
                                            />
                                            <label
                                                className={"form-check-label " + styles.filter_fields}
                                                htmlFor="coachCheck"
                                            >
                                                {capitalize(t("unmatched"))}
                                            </label>
                                        </div>
                                    </div>
                                    <div className={styles.filter_skills_div}>
                                        <div className={styles.filter_top_half}>
                                            <div className={styles.skill_selector}>
                                                <div className={styles.filter_skill_name}>
                                                    {capitalize(t("skills"))}
                                                </div>
                                                <Dropdown
                                                    className={styles.filter_dropdown}
                                                    as={ButtonGroup}
                                                    drop="down"
                                                >
                                                    <Dropdown.Toggle
                                                        variant={"outline-primary"}
                                                        className={styles.filter_button}
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
                                            </div>
                                            <Field
                                                type="text"
                                                name="freeText"
                                                className={styles.filter_search_key}
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
                                        </div>
                                        <div className={styles.filter_bottom_half}>
                                            <div data-testid="roles" className={styles.skill_badges}>
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
                                        </div>
                                        <Button
                                            variant={"outline-primary"}
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={styles.filter_apply_btn}
                                            data-testid="submit"
                                        >
                                            {capitalize(t("apply"))}
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
