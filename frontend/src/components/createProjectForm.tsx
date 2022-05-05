import useTranslation from "next-translate/useTranslation";
import { Badge, Col, FormSelect, Row } from "react-bootstrap";
import styles from "../styles/createProjectForm.module.css";
import { Field, Form, Formik, useFormik } from "formik";
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import { getAllUsersFromPage } from "../api/calls/userCalls";
import { capitalize } from "../utility/stringUtil";
import {
    FormSubmitValues,
    ProjectCreationProps,
    ProjectCreationValues,
} from "../handlers/createProjectSubmitHandler";
import { IUser } from "../api/entities/UserEntity";
import { getAllSkillTypesFromPage } from "../api/calls/skillTypeCalls";
import { getSkillColorMap, ISkillType } from "../api/entities/SkillTypeEntity";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useSwrWithEdition } from "../hooks/utilHooks";
import useEdition from "../hooks/useGlobalEdition";
import { getEntityFromFullUrl } from "../api/calls/baseCalls";

export const CreateProjectForm = (props: ProjectCreationProps) => {
    let userResponse = useSwrWithEdition(apiPaths.users, getAllUsersFromPage);

    let users: IUser[] = userResponse.data || [];
    let userError: Error = userResponse.error;

    let skillTypeResponse = useSwrWithEdition(apiPaths.skillTypes, getAllSkillTypesFromPage);

    let skillTypes: ISkillType[] = skillTypeResponse.data || [];
    let skillTypeError: Error = skillTypeResponse.error;

    const { t } = useTranslation("common");
    const [edition] = useEdition();

    const [coaches, setCoaches] = useState<string[]>([]);
    const [selectedCoach, setSelectedCoach] = useState<string>("");
    const [skills, setSkills] = useState<string[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<string>("");
    const [skillInfos, setSkillInfos] = useState<string[]>([]);
    const [skillInfo, setSkillInfo] = useState<string>("");

    if (userError) {
        console.log(userError);
        return null;
    }

    if (skillTypeError) {
        console.log(skillTypeError);
        return null;
    }

    const skillColorMap = getSkillColorMap(skillTypes);

    function handleChangeCoach(e: ChangeEvent<HTMLInputElement>) {
        setSelectedCoach(e.target.value);
    }

    function handleChangeSkill(event: ChangeEvent<HTMLInputElement>) {
        setSelectedSkill(event.target.value);
    }

    function handleChangeSkillInfo(event: ChangeEvent<HTMLInputElement>) {
        setSkillInfo(event.target.value);
    }

    function handleAddSkill() {
        if (!selectedSkill) {
            setSelectedSkill(skillTypes[0].name);
        }

        const newSkill: string = !selectedSkill ? skillTypes[0].name : selectedSkill;
        const newSkills: string[] = skills.concat(newSkill);

        const newSkillInfo: string = !skillInfo ? capitalize(t("empty skill info")) : skillInfo;
        const newSkillInfos: string[] = skillInfos.concat(newSkillInfo);

        setSkills(newSkills);
        setSkillInfos(newSkillInfos);
        setSkillInfo("");
    }

    function handleAddCoach() {
        const newCoach = selectedCoach ? selectedCoach : users[0].callName;

        if (!selectedCoach) {
            setSelectedCoach(newCoach);
        }

        if (!coaches.includes(newCoach)) {
            const newCoaches: string[] = coaches.concat(newCoach);
            setCoaches(newCoaches);
        }
    }

    function handleDeleteCoach(index: number) {
        delete coaches[index];
        setCoaches(coaches.filter((value) => value !== undefined));
    }

    function handleDeleteSkill(index: number) {
        delete skills[index];
        delete skillInfos[index];
        setSkills(skills.filter((value) => value !== undefined));
        setSkillInfos(skillInfos.filter((value) => value !== undefined));
    }

    async function handleSubmit(submitValues: FormSubmitValues) {
        const createValues: ProjectCreationValues = {
            name: submitValues.name,
            info: submitValues.info,
            versionManagement: submitValues.versionManagement,
            partnerName: submitValues.partnerName,
            partnerWebsite: submitValues.partnerWebsite,
            skills: skills,
            creator: "",
            edition: getEntityFromFullUrl(edition!._links.self.href),
            skillInfos: skillInfos,
            goals: [],
            coaches: [],
        };

        const coachURLs: string[] = [];
        for (let coach of coaches) {
            coachURLs.push(
                // We know there will always be a user with this callname,
                // as every option of the Select contains a value that originates from the users-array
                users.find((item) => item.callName === coach)!._links.self.href
            );
        }

        createValues.coaches = coachURLs;
        props.submitHandler(createValues);
    }

    function initialize() {
        setSelectedCoach(users[0].callName);
        setSelectedSkill(skillTypes[0].name);
    }

    return (
        <div className={styles.create_project_box} data-testid="create-project-form" onLoad={initialize}>
            <Formik
                initialValues={{
                    name: "",
                    info: "",
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
                    <h2>{capitalize(t("create project"))}</h2>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("choose project name"))}
                        name="name"
                        data-testid="projectname-input"
                        placeholder={capitalize(t("project name placeholder"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("enter project info"))}
                        name="info"
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
                        label={capitalize(t("choose coach"))}
                        as="select"
                        name="coach"
                        data-testid="coach-input"
                        placeholder={capitalize(t("choose coach"))}
                        value={selectedCoach}
                        onChange={handleChangeCoach}
                    >
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
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={handleAddCoach}
                        data-testid="add-coach-button"
                    >
                        {capitalize(t("add coach"))}
                    </button>
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
                    {skillInfos.length ? <h5>{capitalize(t("project expertise"))}</h5> : <h5 />}
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
