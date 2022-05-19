import useTranslation from "next-translate/useTranslation";
import { Badge, Col, Row } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import apiPaths from "../../properties/apiPaths";
import { getAllUsersFromLinks, getAllUsersFromPage } from "../../api/calls/userCalls";
import { capitalize } from "../../utility/stringUtil";
import { ProjectCreationValues, ProjectFormSubmitValues } from "../../handlers/projectFormSubmitHandler";
import { IUser } from "../../api/entities/UserEntity";
import { getAllSkillTypesFromPage } from "../../api/calls/skillTypeCalls";
import { getSkillColorMap, ISkillType } from "../../api/entities/SkillTypeEntity";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useEditionAPIUrlTransformer, useSwrWithEdition } from "../../hooks/utilHooks";
import useEdition from "../../hooks/useGlobalEdition";
import { NextRouter, useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import styles from "../../styles/projects/createProject.module.css";
import { ScopedMutator } from "swr/dist/types";
import { IProject } from "../../api/entities/ProjectEntity";
import { getAllProjectSkillsFromLinks } from "../../api/calls/projectSkillCalls";
import { IBaseEntity } from "../../api/entities/BaseEntities";
import { IProjectSkill, ProjectSkill } from "../../api/entities/ProjectSkillEntity";
import SkillBadge from "../util/skillBadge";

/**
 * The props that have to be passed to the component
 */
export type ProjectCreationProps = {
    submitHandler: (
        values: ProjectCreationValues,
        router: NextRouter,
        editionUrl: string,
        ownUser: IUser,
        mutate: ScopedMutator<any>,
        apiURLTransformer: (url: string) => string,
        removedCoaches: string[],
        removeSkillTypes: string[]
    ) => Promise<void>;
    project?: IProject;
};

/**
 * A React component containing a form for project creation
 * @param props ProjectCreationProps containing the submitHandler
 */
export const ProjectForm = ({ submitHandler, project }: ProjectCreationProps) => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [editionUrl] = useEdition();
    const currentUser = useCurrentUser(true);
    const apiTransformer = useEditionAPIUrlTransformer();
    const { mutate } = useSWRConfig();

    // Receive data
    const { data: receivedUsers, error: usersError } = useSwrWithEdition(
        apiPaths.userByEdition,
        getAllUsersFromPage
    );
    const { data: receivedSkillTypes, error: skillTypesError } = useSWR(
        apiPaths.skillTypes,
        getAllSkillTypesFromPage
    );

    const allUsers: IUser[] = receivedUsers || [];
    const skillTypes: ISkillType[] = receivedSkillTypes || [];

    // ===================================== Get the states =====================================

    const [mutated, setMutated] = useState<boolean>(false);

    if (mutated) {
        setMutated(false);
    }

    // Fetch items
    // Skills and coaches
    const { data: receivedCoaches, error: coachesError } = useSWR(
        project ? project._links.coaches.href : null,
        getAllUsersFromLinks
    );
    const { data: receivedSkills, error: skillsError } = useSWR(
        project ? project._links.neededSkills.href : null,
        getAllProjectSkillsFromLinks
    );
    const existingCoaches: IUser[] = receivedCoaches || [];
    const existingSkills: IProjectSkill[] = receivedSkills || [];

    // removed items
    const [removedCoaches] = useState<Set<string>>(new Set());
    const [removedSkills] = useState<Set<string>>(new Set());

    // altered items
    const [alteredSkills, setAlteredSkills] = useState<[string, ProjectSkill][]>([]);

    // list content states
    const [goals, setGoals] = useState<string[]>([]);

    const propsGoals = project?.goals;

    useEffect(() => {
        if (propsGoals) {
            setGoals(propsGoals);
        }
    }, [propsGoals]);

    // create items
    const [createdCoaches, setCreatedCoaches] = useState<string[]>([]);
    const [createdSkillNames, setCreatedSkillNames] = useState<string[]>([]);
    const [createdSkillInfos, setCreatedSkillInfos] = useState<string[]>([]);

    // State of input fields
    const [goalInput, setGoalInput] = useState<string>("");
    const [selectedCoach, setSelectedCoach] = useState<string>("");
    const [selectedSkill, setSelectedSkill] = useState<string>("");
    const [skillInfo, setSkillInfo] = useState<string>("");

    if (usersError || skillTypesError || !currentUser || !editionUrl) {
        console.log(usersError || skillTypesError || !currentUser || !editionUrl);
        return null;
    }

    // Implement some handlers

    function handleAddCreatedSkill() {
        if (!selectedSkill) {
            setSelectedSkill(skillTypes[0].name);
        }

        const newSkill: string = !selectedSkill ? skillTypes[0].name : selectedSkill;
        const newSkills: string[] = createdSkillNames.concat(newSkill);

        const newSkillInfo: string = !skillInfo ? capitalize(t("skill info")) : skillInfo;

        setCreatedSkillNames(newSkills);
        setCreatedSkillInfos([...createdSkillInfos, newSkillInfo]);
        setSkillInfo("");
    }

    function handleAddCreatedCoach() {
        const newCoach = selectedCoach ? selectedCoach : allUsers[0].callName;

        if (!selectedCoach) {
            setSelectedCoach(newCoach);
        }

        if (!createdCoaches.includes(newCoach)) {
            setCreatedCoaches([...createdCoaches, newCoach]);
        }
    }

    async function handleSubmit(submitValues: ProjectFormSubmitValues) {
        const coachURLs: string[] = [];
        for (const coach of createdCoaches) {
            coachURLs.push(
                // We know there will always be a user with this callname,
                // as every option of the Select contains a value that originates from the users-array
                allUsers.find((item) => item.callName === coach)!._links.self.href
            );
        }

        const createValues: ProjectCreationValues = {
            name: submitValues.name,
            info: submitValues.info,
            versionManagement: submitValues.versionManagement,
            partnerName: submitValues.partnerName,
            partnerWebsite: submitValues.partnerWebsite,
            skills: createdSkillNames,
            creator: "",
            edition: "",
            skillInfos: createdSkillInfos,
            goals: goals,
            coaches: coachURLs,
        };

        // We can use ! for edition and currentUser because this function is never called if it is undefined.
        await submitHandler(
            createValues,
            router,
            editionUrl!,
            currentUser.user!,
            mutate,
            apiTransformer,
            Array.from(removedCoaches),
            Array.from(removedSkills)
        );
    }

    function initialize() {
        setSelectedCoach(allUsers[0].callName);
        setSelectedSkill(skillTypes[0].name);
    }

    const initialValues: ProjectFormSubmitValues = project
        ? {
              name: project.name,
              info: project.info,
              versionManagement: project.versionManagement,
              partnerName: project.partnerName,
              partnerWebsite: project.partnerWebsite,
          }
        : {
              name: "",
              info: "",
              versionManagement: "",
              partnerName: "",
              partnerWebsite: "",
          };

    return (
        <div
            className={styles.create_project_box}
            data-testid="create-project-form w-100"
            onLoad={initialize}
        >
            <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
                <Form>
                    <h2>{capitalize(t("create project"))}</h2>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("project name"))}
                        name="name"
                        data-testid="projectname-input"
                        placeholder={capitalize(t("project name"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("project info"))}
                        name="info"
                        data-testid="projectinfo-input"
                        placeholder={capitalize(t("project info"))}
                    />
                    {goals.map((goal: string, index: number) => (
                        <Row key={index}>
                            <Col>{goal}</Col>
                            <Col xs={1}>
                                <a>
                                    <Image
                                        onClick={() =>
                                            setGoals(goals.filter((_, valIndex) => valIndex !== index))
                                        }
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
                        label={capitalize(t("project goal"))}
                        data-testid="goal-input"
                        value={goalInput}
                        placeholder={capitalize(t("project goal"))}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setGoalInput(e.target.value)}
                    />
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={(e) => {
                            if (goalInput) {
                                setGoals([...goals, goalInput]);
                                setGoalInput("");
                            }
                        }}
                        data-testid="add-goal-button"
                    >
                        {capitalize(t("add goal"))}
                    </button>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("version control URL"))}
                        name="versionManagement"
                        data-testid="versionmanagement-input"
                        placeholder={capitalize(t("version control URL"))}
                        required
                    />
                    {existingCoaches
                        .filter((coach) => !removedCoaches.has(coach._links.self.href))
                        .map((coach: IUser) => (
                            <Row key={coach._links.self.href}>
                                {/* Might be prettier to just blur coaches that have been removed so you can add them again */}
                                <Col>{coach.callName}</Col>
                                <Col xs={1}>
                                    <a>
                                        <Image
                                            onClick={() => {
                                                removedCoaches.add(coach._links.self.href);
                                                setMutated(true);
                                            }}
                                            alt=""
                                            src={"/resources/delete.svg"}
                                            width="15"
                                            height="15"
                                        />
                                    </a>
                                </Col>
                            </Row>
                        ))}
                    {createdCoaches.map((coach: string, index: number) => (
                        <Row key={index}>
                            <Col>{coach}</Col>
                            <Col xs={1}>
                                <a>
                                    <Image
                                        onClick={() =>
                                            setCreatedCoaches(
                                                createdCoaches.filter((_, valIndex) => valIndex !== index)
                                            )
                                        }
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
                        label={capitalize(t("coach"))}
                        as="select"
                        name="coach"
                        data-testid="coach-input"
                        placeholder={capitalize(t("coach"))}
                        value={selectedCoach}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedCoach(e.target.value)}
                    >
                        {allUsers.map((user) => (
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
                        onClick={handleAddCreatedCoach}
                        data-testid="add-coach-button"
                    >
                        {capitalize(t("add coach"))}
                    </button>
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("partner name"))}
                        name="partnerName"
                        data-testid="partnername-input"
                        placeholder={capitalize(t("partner name"))}
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        label={capitalize(t("partner website"))}
                        name="partnerWebsite"
                        data-testid="partnerwebsite-input"
                        placeholder={capitalize(t("partner website"))}
                        required
                    />
                    {createdSkillInfos.length + (receivedSkills || []).length ? (
                        <h5>{capitalize(t("project expertise"))}</h5>
                    ) : (
                        <h5 />
                    )}
                    {existingSkills
                        .filter((skill) => !removedSkills.has(skill._links.self.href))
                        .map((skill: IProjectSkill) => (
                            <Row key={skill._links.self.href}>
                                <Col>
                                    <SkillBadge skill={skill.name} />
                                </Col>
                                <Col>{": " + skillInfo}</Col>
                                <Col xs={6}>
                                    <Image
                                        onClick={() => {
                                            setMutated(true);
                                            removedSkills.add(skill._links.self.href);
                                        }}
                                        alt=""
                                        src={"/resources/delete.svg"}
                                        width="15"
                                        height="15"
                                    />
                                </Col>
                            </Row>
                        ))}
                    {createdSkillInfos.map((skillInfo: string, index: number) => (
                        <Row key={index}>
                            <Col>
                                <SkillBadge skill={createdSkillNames[index]} />
                            </Col>
                            <Col>{": " + skillInfo}</Col>
                            <Col xs={6}>
                                <Image
                                    onClick={() => {
                                        setCreatedSkillNames(
                                            createdSkillNames.filter((_, valIndex) => index !== valIndex)
                                        );
                                        setCreatedSkillInfos(
                                            createdSkillInfos.filter((_, valIndex) => index !== valIndex)
                                        );
                                    }}
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
                        label={capitalize(t("skill type"))}
                        as="select"
                        name="skillType"
                        data-testid="skill-input"
                        value={selectedSkill}
                        placeholder={capitalize(t("skill type"))}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedSkill(e.target.value)}
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSkillInfo(e.target.value)}
                    />
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={handleAddCreatedSkill}
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
