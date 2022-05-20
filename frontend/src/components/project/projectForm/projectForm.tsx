import useTranslation from "next-translate/useTranslation";
import { Col, Row } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import { getAllUsersFromLinks } from "../../../api/calls/userCalls";
import { capitalize } from "../../../utility/stringUtil";
import { ProjectCreationValues, ProjectFormSubmitValues } from "../../../handlers/projectFormSubmitHandler";
import { IUser } from "../../../api/entities/UserEntity";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useEditionAPIUrlTransformer } from "../../../hooks/utilHooks";
import useEdition from "../../../hooks/useGlobalEdition";
import { NextRouter, useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import styles from "../../../styles/projects/createProject.module.css";
import { ScopedMutator } from "swr/dist/types";
import { IProject, Project } from "../../../api/entities/ProjectEntity";
import { getAllProjectSkillsFromLinks } from "../../../api/calls/projectSkillCalls";
import { IProjectSkill, ProjectSkill, projectSkillFromIProjectSkill } from "../../../api/entities/ProjectSkillEntity";
import CreateGoalsSubForm from "./createGoalSubForm";
import CreateCoachSubForm from "./createCoachSubForm";
import CreateProjectSkillSubForm from "./createProjectSkillSubForm";
import EditProjectSkillSubForm from "./editProjectSkillSubForm";

/**
 * The props that have to be passed to the component
 */
export type ProjectCreationProps = {
    submitHandler: (
        project: IProject | null,
        values: ProjectCreationValues,
        removedCoaches: string[],
        removeProjectSkills: string[],
        alteredSkills: [string, ProjectSkill][],
        editionUrl: string,
        ownUser: IUser,
        router: NextRouter,
        mutate: ScopedMutator<any>,
        apiURLTransformer: (url: string) => string
    ) => Promise<boolean>;
    project?: IProject;
};

type AlteredSkillMapper = { [projectSkillUrl: string]: ProjectSkill };

/**
 * A React component containing a form for project creation
 * @param props ProjectCreationProps containing the submitHandler
 */
export const ProjectForm = ({ submitHandler, project }: ProjectCreationProps) => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [editionUrl] = useEdition();
    const { user: currentUser } = useCurrentUser(true);
    const apiTransformer = useEditionAPIUrlTransformer();
    const { mutate } = useSWRConfig();

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
    const [alteredSkills] = useState<AlteredSkillMapper>({});

    // list content states
    const [goals, setGoals] = useState<string[]>([]);
    const propsGoals = project?.goals;
    useEffect(() => {
        if (propsGoals) {
            setGoals(propsGoals);
        }
    }, [propsGoals]);

    // create items
    const [createdCoachesUrls, setCreatedCoachesUrls] = useState<string[]>([]);
    const [createdSkillNames, setCreatedSkillNames] = useState<string[]>([]);
    const [createdSkillInfos, setCreatedSkillInfos] = useState<string[]>([]);

    // Error safety
    if (coachesError || skillsError) {
        console.log(coachesError || skillsError);
        return null;
    }

    // Create some handlers
    async function handleSubmit(submitValues: ProjectFormSubmitValues) {
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
            coaches: [
                ...createdCoachesUrls,
                ...existingCoaches
                    .map((coach) => coach._links.self.href)
                    .filter((coach) => !removedCoaches.has(coach)),
            ],
        };

        // We can use ! for edition and currentUser because this function is never called if it is undefined.
        await submitHandler(
            project ? project : null,
            createValues,
            Array.from(removedCoaches),
            Array.from(removedSkills),
            Object.entries(alteredSkills),
            editionUrl!,
            currentUser!,
            router,
            mutate,
            apiTransformer
        );
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
        >
            <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
                <Form onKeyPress={e => { e.which === 13 && e.preventDefault() }}>
                    <h2>{capitalize(t("create project"))}</h2>
                    <label htmlFor="project-name">{capitalize(t("project name"))}:</label>
                    <Field
                        className="form-control mb-2"
                        id="project-name"
                        label={capitalize(t("project name"))}
                        name="name"
                        data-testid="projectname-input"
                        placeholder={capitalize(t("project name"))}
                        required
                    />
                    <label htmlFor="project-info">{capitalize(t("project info"))}:</label>
                    <Field
                        className="form-control mb-2"
                        id="project-info"
                        label={capitalize(t("project info"))}
                        name="info"
                        data-testid="projectinfo-input"
                        placeholder={capitalize(t("project info"))}
                    />
                    <label>Goals:</label>
                    <CreateGoalsSubForm goals={goals} setGoals={setGoals}/>
                    <label htmlFor="version-management">{capitalize(t("version control URL"))}:</label>
                    <Field
                        className="form-control mb-2"
                        id="version-management"
                        label={capitalize(t("version control URL"))}
                        name="versionManagement"
                        data-testid="versionmanagement-input"
                        placeholder={capitalize(t("version control URL"))}
                    />
                    <label>Coaches:</label>
                    {existingCoaches
                        .filter((coach) => !removedCoaches.has(coach._links.self.href))
                        .map((coach: IUser) => (
                            <Row key={coach._links.self.href}>
                                {/* Might be prettier to just blur coaches that have been removed.
                                That way you would be able to add them again */}
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
                    <CreateCoachSubForm setCoachUrls={setCreatedCoachesUrls}/>

                    <label htmlFor="partner-name">{capitalize(t("partner name"))}:</label>
                    <Field
                        className="form-control mb-2"
                        id="partner-name"
                        label={capitalize(t("partner name"))}
                        name="partnerName"
                        data-testid="partnername-input"
                        placeholder={capitalize(t("partner name"))}
                        required
                    />

                    <label htmlFor="partner-website">{capitalize(t("partner website"))}:</label>
                    <Field
                        className="form-control mb-2"
                        id="partner-website"
                        label={capitalize(t("partner website"))}
                        name="partnerWebsite"
                        data-testid="partnerwebsite-input"
                        placeholder={capitalize(t("partner website"))}
                    />

                    <h5>{capitalize(t("project expertise"))}</h5>
                    {existingSkills
                        .filter((skill) => !removedSkills.has(skill._links.self.href))
                        .map((skill: IProjectSkill) =>
                            <EditProjectSkillSubForm
                                key={skill._links.self.href}
                                skill={skill._links.self.href in alteredSkills ? alteredSkills[skill._links.self.href] : projectSkillFromIProjectSkill(skill)}
                                registerRemoval={() => {
                                    setMutated(true);
                                    removedSkills.add(skill._links.self.href);
                                }}
                                registerAlteration={(newSkill => {
                                    alteredSkills[skill._links.self.href] = newSkill;
                                    setMutated(true);
                                })}
                            />
                        )}
                    <CreateProjectSkillSubForm
                        createdSkillNames={createdSkillNames}
                        setCreatedSkillNames={setCreatedSkillNames}
                        createdSkillInfos={createdSkillInfos}
                        setCreatedSkillInfos={setCreatedSkillInfos}
                    />

                    <button className="btn btn-primary" type="submit" data-testid="create-project-button">
                        {project ? "edit project" : capitalize(t("create project"))}
                    </button>
                </Form>
            </Formik>
        </div>
    );
};
