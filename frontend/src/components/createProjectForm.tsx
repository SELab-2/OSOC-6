import useTranslation from "next-translate/useTranslation";
import { Button, Col, Form, FormCheck, ListGroup, Row } from "react-bootstrap";
import styles from "../styles/createProjectForm.module.css";
import { Field, Formik } from "formik";
import { Simulate } from "react-dom/test-utils";
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import { getAllUsersFromPage } from "../api/calls/userCalls";
import { capitalize } from "../utility/stringUtil";
import { createProjectSubmitHandler, ProjectCreationProps } from "../handlers/createProjectSubmitHandler";
import { IUser } from "../api/entities/UserEntity";
import { getAllSkillTypesFormPage } from "../api/calls/skillTypeCalls";
import { ISkillType, SkillType } from "../api/entities/SkillTypeEntity";
import { ChangeEvent, useState } from "react";
import { ProjectSkill } from "../api/entities/ProjectSkillEntity";
import Image from "next/image";

export const CreateProjectForm = (props: ProjectCreationProps) => {
    let userResponse = useSWR(apiPaths.users, getAllUsersFromPage);

    let users: IUser[] = userResponse.data || [];
    let userError: Error = userResponse.error;

    let skillTypeResponse = useSWR(apiPaths.skillTypes, getAllSkillTypesFormPage);

    let skillTypes: ISkillType[] = skillTypeResponse.data || [];
    let skillTypeError: Error = skillTypeResponse.error;

    const { t } = useTranslation("common");
    const [skills, setSkills] = useState<string[] | []>([]);
    const [selectedSkill, setSelectedSkill] = useState<string>("other");
    const [skillInfos, setSkillInfos] = useState<string[] | []>([]);
    const [skillInfo, setSkillInfo] = useState<string>("");

    if (userError) {
        console.log(userError);
        return null;
    }

    if (skillTypeError) {
        console.log(skillTypeError);
        return null;
    }

    function handleChangeSkill(e: ChangeEvent<HTMLInputElement>) {
        console.log("EVENT");
        console.log(e);
        console.log(e.target.value);
        setSelectedSkill(e.target.value);
    }

    function handleChangeSkillInfo(e: ChangeEvent<HTMLInputElement>) {
        console.log("EVENT");
        console.log(e);
        console.log(e.target.value);
        setSkillInfo(e.target.value);
    }

    function handleDeleteSkill(index: number) {
        delete skills[index];
        delete skillInfos[index];
        setSkills(skills.filter((value) => value !== undefined));
        setSkillInfos(skillInfos.filter((value) => value !== undefined));
    }

    function handleAddSkill() {
        const newSkills: string[] = (skills as string[]).concat(selectedSkill);

        let newSkillInfo = skillInfo === "" ? "No special info" : skillInfo;
        const newSkillInfos = (skillInfos as string[]).concat(selectedSkill + ": " + newSkillInfo);

        console.log("SKILLS");
        console.log(skills);
        setSkills(newSkills);
        setSkillInfos(newSkillInfos);
        setSkillInfo("");
    }

    //data = data.filter((user: IUser) => user.userRole === "COACH")
    console.log("DATA");
    //console.log(users);
    console.log(props);

    return (
        <div className={styles.create_project_box}>
            <Formik
                initialValues={{
                    projectName: "",
                    versionManagement: "",
                    coach: "",
                    partnerName: "",
                    partnerWebsite: "",
                    skillType: "",
                    skillInfo: "",
                }}
                //onSubmit={(values) => createProjectSubmitHandler(values)}
                //onSubmit={() => console.log("amettn")}
                onSubmit={props.submitHandler}
            >
                <Form>
                    <h2>Create new project</h2>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose project name"))}
                        name="projectName"
                        placeholder={capitalize(t("project name placeholder"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose version control URL"))}
                        name="versionManagement"
                        placeholder={capitalize(t("version control placeholder"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose coach"))}
                        as="select"
                        name="coach"
                        placeholder={capitalize(t("choose coach"))}
                        required
                    >
                        {users.map((user) => (
                            <option key={user.callName} value={user.callName} label={user.callName}>
                                {user.callName}
                            </option>
                        ))}
                    </Field>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose partner name"))}
                        name="partnerName"
                        placeholder={capitalize(t("partner name placeholder"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose partner website"))}
                        name="partnerWebsite"
                        placeholder={capitalize(t("partner website placeholder"))}
                        required
                    />
                    {skillInfos.length !== 0 ? <h5>{capitalize(t("needed expertise"))}</h5> : <h5 />}
                    {skillInfos.map((skillInfo: string, index: number) => (
                        <Row key={index}>
                            <Col>{skillInfo}</Col>
                        </Row>
                    ))}
                    <h5>{capitalize(t("choose roles"))}</h5>
                    {skills.map((skillType: string, index: number) => (
                        <Row key={index}>
                            <Col>{skillType}</Col>
                            <Col xs={1}>
                                <a>
                                    <Image
                                        onClick={() => handleDeleteSkill(index)}
                                        alt=""
                                        src={"/resources/delete.svg"}
                                        width="15"
                                        height="15"
                                    />
                                </a>
                            </Col>
                        </Row>
                    ))}
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose skill type"))}
                        as="select"
                        name="skillType"
                        value={selectedSkill}
                        placeholder={capitalize(t("choose skill type"))}
                        onChange={handleChangeSkill}
                    >
                        {skillTypes.map((skillType) => (
                            <option key={skillType.name} value={skillType.name} label={skillType.name}>
                                {skillType.name}
                            </option>
                        ))}
                    </Field>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("extra skill info"))}
                        name="skillInfo"
                        value={skillInfo}
                        placeholder={capitalize(t("extra skill info placeholder"))}
                        onChange={handleChangeSkillInfo}
                    />
                    <button className="btn btn-secondary" onClick={handleAddSkill}>
                        {capitalize(t("add skill"))}
                    </button>
                    <button className="btn btn-primary" type="submit">
                        {capitalize(t("create project"))}
                    </button>
                </Form>
            </Formik>
        </div>
    );
};
