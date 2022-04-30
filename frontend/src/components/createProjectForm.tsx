import useTranslation from "next-translate/useTranslation";
import { Badge, Col, Row } from "react-bootstrap";
import styles from "../styles/createProjectForm.module.css";
import { Field, Form, Formik } from "formik";
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import { getAllUsersFromPage } from "../api/calls/userCalls";
import { capitalize } from "../utility/stringUtil";
import {
    createProjectSubmitHandler,
    ProjectCreationProps,
    ProjectCreationValues,
} from "../handlers/createProjectSubmitHandler";
import { IUser } from "../api/entities/UserEntity";
import { getAllSkillTypesFromPage } from "../api/calls/skillTypeCalls";
import { ISkillType } from "../api/entities/SkillTypeEntity";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { minify } from "next/dist/build/swc";

export const CreateProjectForm = (props: ProjectCreationProps) => {
    let userResponse = useSWR(apiPaths.users, getAllUsersFromPage);

    let users: IUser[] = userResponse.data || [];
    let userError: Error = userResponse.error;

    let skillTypeResponse = useSWR(apiPaths.skillTypes, getAllSkillTypesFromPage);

    let skillTypes: ISkillType[] = skillTypeResponse.data || [];
    let skillTypeError: Error = skillTypeResponse.error;

    const { t } = useTranslation("common");

    const [coaches, setCoaches] = useState<string[] | []>([]);
    const [hasPickedCoach, setHasPickedCoach] = useState<boolean>(false);
    const [selectedCoach, setSelectedCoach] = useState<string>("");
    const [skills, setSkills] = useState<string[] | []>([]);
    const [selectedSkill, setSelectedSkill] = useState<string>("");
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

    let skillColorMap = new Map<string, string>();

    for (let skillType of skillTypes) {
        skillColorMap.set(skillType.name, skillType.colour);
    }

    function handleChangeSkill(e: ChangeEvent<HTMLInputElement>) {
        setSelectedSkill(e.target.value);
    }

    function handleChangeSkillInfo(e: ChangeEvent<HTMLInputElement>) {
        setSkillInfo(e.target.value);
    }

    function handleDeleteSkill(index: number) {
        delete skills[index];
        delete skillInfos[index];
        setSkills(skills.filter((value) => value !== undefined));
        setSkillInfos(skillInfos.filter((value) => value !== undefined));
    }

    function handleAddSkill() {
        const newSkill = selectedSkill === "" ? skillTypes[0].name : selectedSkill;
        const newSkills: string[] = (skills as string[]).concat(newSkill);

        let newSkillInfo = skillInfo === "" ? capitalize(t("empty skill info")) : skillInfo;
        const newSkillInfos = (skillInfos as string[]).concat(newSkillInfo);

        setSkills(newSkills);
        setSkillInfos(newSkillInfos);
        setSkillInfo("");
    }

    function handleAddCoach(e: ChangeEvent<HTMLInputElement>) {
        setHasPickedCoach(true);

        if (!(coaches as string[]).includes(e.target.value)) {
            const newCoaches: string[] = (coaches as string[]).concat(e.target.value);
            setCoaches(newCoaches);
        }

        setSelectedCoach(e.target.value);
    }

    function handleDeleteCoach(index: number) {
        delete coaches[index];
        setCoaches(coaches.filter((value) => value !== undefined));
    }

    async function handleSubmit(values: ProjectCreationValues) {
        values.skills = skills;
        values.skillInfos = skillInfos;

        const coachURLs: string[] = [];
        for (let coach of coaches) {
            coachURLs.push(
                // @ts-ignore
                // We know there will always be a user with this callname
                users.find((item) => item.callName === coach)._links.self.href
            );
        }

        values.coaches = coachURLs;
        props.submitHandler(values);
    }

    return (
        <div className={styles.create_project_box} data-testid="create-project-form">
            <Formik
                initialValues={{
                    projectName: "",
                    projectInfo: "",
                    versionManagement: "",
                    coaches: [],
                    partnerName: "",
                    partnerWebsite: "",
                    skills: [],
                    skillInfos: [],
                }}
                onSubmit={handleSubmit}
            >
                <Form>
                    <h2>Create new project</h2>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose project name"))}
                        name="projectName"
                        data-testid="projectname-input"
                        placeholder={capitalize(t("project name placeholder"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("enter project info"))}
                        name="projectInfo"
                        data-testid="projectinfo-input"
                        placeholder={capitalize(t("project info placeholder"))}
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose version control URL"))}
                        name="versionManagement"
                        data-testid="versionmanagement-input"
                        placeholder={capitalize(t("version control placeholder"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose coach"))}
                        as="select"
                        name="coach"
                        data-testid="coach-input"
                        placeholder={capitalize(t("choose coach"))}
                        value={selectedCoach}
                        onChange={handleAddCoach}
                    >
                        {!hasPickedCoach ? <option>{capitalize(t("choose coach"))}</option> : <></>}
                        {users.map((user) => (
                            <option
                                key={user.callName}
                                value={user.callName}
                                label={user.callName}
                                data-testid={"user-" + user.callName}
                            >
                                {user.callName}
                            </option>
                        ))}
                    </Field>
                    {coaches.map((coach: string, index: number) => (
                        <Row key={index}>
                            <Col>{coach}</Col>
                            <Col xs={1}>
                                <a>
                                    <Image
                                        onClick={() => handleDeleteCoach(index)}
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
                        label={capitalize(t("choose partner name"))}
                        name="partnerName"
                        data-testid="partnername-input"
                        placeholder={capitalize(t("partner name placeholder"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose partner website"))}
                        name="partnerWebsite"
                        data-testid="partnerwebsite-input"
                        placeholder={capitalize(t("partner website placeholder"))}
                        required
                    />
                    {skillInfos.length !== 0 ? <h5>{capitalize(t("project expertise"))}</h5> : <h5 />}
                    {skillInfos.map((skillInfo: string, index: number) => (
                        <Row key={index}>
                            <Col>
                                <Badge bg="" style={{ backgroundColor: skillColorMap.get(skills[index]) }}>
                                    {skills[index]}
                                </Badge>
                            </Col>
                            <Col>{": " + skillInfo}</Col>
                        </Row>
                    ))}
                    <h5>{capitalize(t("choose roles"))}</h5>
                    {skills.map((skillType: string, index: number) => (
                        <Row key={index}>
                            <Col>
                                <Badge bg="" style={{ backgroundColor: skillColorMap.get(skillType) }}>
                                    {skillType}
                                </Badge>
                            </Col>
                            <Col xs={6}>
                                <Image
                                    onClick={() => handleDeleteSkill(index)}
                                    alt=""
                                    src={"/resources/delete.svg"}
                                    width="15"
                                    height="15"
                                />
                            </Col>
                        </Row>
                    ))}
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose skill type"))}
                        as="select"
                        name="skillType"
                        data-testid="skill-input"
                        value={selectedSkill}
                        placeholder={capitalize(t("choose skill type"))}
                        onChange={handleChangeSkill}
                    >
                        {skillTypes.map((skillType) => (
                            <option
                                key={skillType.name}
                                value={skillType.name}
                                label={skillType.name}
                                data-testid={"skilltype-" + skillType.name}
                            >
                                {skillType.name}
                            </option>
                        ))}
                    </Field>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("extra skill info"))}
                        name="skillInfo"
                        data-testid="skillinfo-input"
                        value={skillInfo}
                        placeholder={capitalize(t("extra skill info placeholder"))}
                        onChange={handleChangeSkillInfo}
                    />
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={handleAddSkill}
                        data-testid="add-skill-button"
                    >
                        {capitalize(t("add skill"))}
                    </button>
                    <button className="btn btn-primary" type="submit" data-testid="create-project-button">
                        {capitalize(t("create project"))}
                    </button>
                </Form>
            </Formik>
        </div>
    );
};
