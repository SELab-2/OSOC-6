import useTranslation from "next-translate/useTranslation";
import { Col, Container, Row } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import { getAllUsersFromLinks } from "../../../api/calls/userCalls";
import { capitalize, isValidURIOrEmpty } from "../../../utility/stringUtil";
import { ProjectCreationValues, projectFormSubmitHandler } from "../../../handlers/projectFormSubmitHandler";
import { IUser } from "../../../api/entities/UserEntity";
import { useEffect, useState } from "react";
import { useEditionAPIUrlTransformer, useSwrForEntityList } from "../../../hooks/utilHooks";
import useEdition from "../../../hooks/useGlobalEdition";
import { useSWRConfig } from "swr";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import styles from "../../../styles/projects/createProject.module.css";
import { IProject } from "../../../api/entities/ProjectEntity";
import { getAllProjectSkillsFromLinks } from "../../../api/calls/projectSkillCalls";
import {
    IProjectSkill,
    ProjectSkill,
    projectSkillFromIProjectSkill,
} from "../../../api/entities/ProjectSkillEntity";
import CreateCoachSubForm from "./createCoachSubForm";
import CreateProjectSkillSubForm from "./createProjectSkillSubForm";
import EditProjectSkillSubForm from "./editProjectSkillSubForm";
import ItemListForm from "../../util/itemListForm";
import { ConfirmDeleteButton } from "../../util/confirmDeleteButton";
import { useRouterPush } from "../../../hooks/routerHooks";

/**
 * Properties needed by [ProjectForm].
 */
export type ProjectCreationProps = {
    project?: IProject;
};

/**
 * Interface describing the shape of the values used by the formik instance in this form.
 */
interface ProjectFormSubmitValues {
    name: string;
    info: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;
}

type AlteredSkillMapper = { [projectSkillUrl: string]: ProjectSkill };

/**
 * A form that allows you to create or edit a project.
 * Includes the creation of projectSkills.
 * Allows you to link coaches to the project.
 * @param project the project that needs to be edited. Undefined when in project creation mode.
 */
export function ProjectForm({ project }: ProjectCreationProps) {
    const { t } = useTranslation("common");
    const routerAction = useRouterPush();
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
    const { data: receivedCoaches, error: coachesError } = useSwrForEntityList(
        project ? project._links.coaches.href : null,
        getAllUsersFromLinks
    );
    const { data: receivedSkills, error: skillsError } = useSwrForEntityList(
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
        if (
            isValidURIOrEmpty(submitValues.versionManagement) &&
            isValidURIOrEmpty(submitValues.partnerWebsite)
        ) {
            const createValues: ProjectCreationValues = {
                name: submitValues.name,
                info: submitValues.info,
                versionManagement: submitValues.versionManagement,
                partnerName: submitValues.partnerName,
                partnerWebsite: submitValues.partnerWebsite,
                addedSkills: createdSkillNames,
                addedSkillsInfo: createdSkillInfos,
                goals: goals,
                coaches: [
                    ...createdCoachesUrls,
                    ...existingCoaches
                        .map((coach) => coach._links.self.href)
                        .filter((coach) => !removedCoaches.has(coach)),
                ],
            };

            // We can use ! for edition and currentUser because this function is never called if it is undefined.
            await projectFormSubmitHandler(
                project ? project : null,
                createValues,
                Array.from(removedSkills),
                Object.entries(alteredSkills),
                editionUrl!,
                currentUser!,
                routerAction,
                mutate,
                apiTransformer
            );
        }
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
        <Container className={styles.create_project_box} data-testid="create-project-form w-100">
            <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
                {({ values, touched }) => (
                    <Form
                        // This is needed so pressing enter does not submit the form.
                        // I Personally pressed enter a lot of times to for example to add a goal.
                        // Resulting in a lot of premature submissions.
                        onKeyPress={(e) => {
                            e.which === 13 && e.preventDefault();
                        }}
                    >
                        <h3 style={{ marginTop: "4rem" }}>
                            {project ? capitalize(t("edit project")) : capitalize(t("create project"))}
                        </h3>
                        <hr />
                        <label className={styles.label} htmlFor="project-name">
                            {capitalize(t("project name"))}:
                        </label>
                        <Field
                            className={styles.input_field + " form-control mb-2"}
                            id="project-name"
                            label={capitalize(t("project name"))}
                            name="name"
                            data-testid="projectname-input"
                            placeholder={capitalize(t("project name"))}
                            required
                        />

                        <label className={styles.label} htmlFor="project-info">
                            {capitalize(t("project info"))}:
                        </label>
                        <Field
                            className={styles.input_field + " form-control mb-2"}
                            id="project-info"
                            label={capitalize(t("project info"))}
                            name="info"
                            data-testid="projectinfo-input"
                            placeholder={capitalize(t("project info"))}
                        />
                        <ItemListForm
                            items={goals}
                            setItems={setGoals}
                            itemInputText={capitalize(t("project goals"))}
                            itemAddText={capitalize(t("add goal"))}
                            itemPlaceHolderText={capitalize(t("project goal"))}
                        />

                        <label className={styles.label} htmlFor="version-management">
                            {capitalize(t("version control URL"))}:
                        </label>
                        <Field
                            className={styles.input_field + " form-control mb-2"}
                            id="version-management"
                            label={capitalize(t("version control URL"))}
                            name="versionManagement"
                            data-testid="versionmanagement-input"
                            placeholder={capitalize(t("version control URL"))}
                        />
                        {!isValidURIOrEmpty(values.versionManagement) && touched.versionManagement ? (
                            <div className={styles.error_message}>{capitalize(t("invalid uri"))}</div>
                        ) : null}

                        <label className={styles.label}>{capitalize(t("coaches"))}:</label>
                        <ul style={{ listStyleType: "circle" }}>
                            {existingCoaches
                                .filter((coach) => !removedCoaches.has(coach._links.self.href))
                                .map((coach: IUser) => (
                                    <li key={coach._links.self.href} style={{ marginLeft: "3rem" }}>
                                        <Row>
                                            {/* Might be prettier to just blur coaches that have been removed.
                                    That way you would be able to add them again */}
                                            <Col>{coach.callName}</Col>
                                            <Col xs={1}>
                                                <ConfirmDeleteButton
                                                    dataTestId={"remove-existing-coach-" + coach.callName}
                                                    handler={() => {
                                                        removedCoaches.add(coach._links.self.href);
                                                        setMutated(true);
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </li>
                                ))}
                        </ul>
                        <CreateCoachSubForm
                            setCoachUrls={setCreatedCoachesUrls}
                            illegalCoaches={existingCoaches
                                .filter((coach) => !removedCoaches.has(coach._links.self.href))
                                .map((coach) => coach.callName)}
                        />

                        <label className={styles.label} htmlFor="partner-name">
                            {capitalize(t("partner name"))}:
                        </label>
                        <Field
                            className={styles.input_field + " form-control mb-2"}
                            id="partner-name"
                            label={capitalize(t("partner name"))}
                            name="partnerName"
                            data-testid="partnername-input"
                            placeholder={capitalize(t("partner name"))}
                            required
                        />

                        <label className={styles.label} htmlFor="partner-website">
                            {capitalize(t("partner website"))}:
                        </label>
                        <Field
                            className={styles.input_field + " form-control mb-2"}
                            id="partner-website"
                            label={capitalize(t("partner website"))}
                            name="partnerWebsite"
                            data-testid="partnerwebsite-input"
                            placeholder={capitalize(t("partner website"))}
                        />
                        {!isValidURIOrEmpty(values.partnerWebsite) && touched.partnerWebsite ? (
                            <div className={styles.error_message}>{capitalize(t("invalid uri"))}</div>
                        ) : null}

                        <label className={styles.label}>{capitalize(t("project expertise"))}</label>
                        {existingSkills
                            .filter((skill) => !removedSkills.has(skill._links.self.href))
                            .map((skill: IProjectSkill) => (
                                <EditProjectSkillSubForm
                                    key={skill._links.self.href}
                                    skill={
                                        skill._links.self.href in alteredSkills
                                            ? alteredSkills[skill._links.self.href]
                                            : projectSkillFromIProjectSkill(skill, project!._links.self.href)
                                    }
                                    registerRemoval={() => {
                                        setMutated(true);
                                        removedSkills.add(skill._links.self.href);
                                    }}
                                    registerAlteration={(newSkill) => {
                                        alteredSkills[skill._links.self.href] = newSkill;
                                        setMutated(true);
                                    }}
                                />
                            ))}
                        <CreateProjectSkillSubForm
                            createdSkillNames={createdSkillNames}
                            setCreatedSkillNames={setCreatedSkillNames}
                            createdSkillInfos={createdSkillInfos}
                            setCreatedSkillInfos={setCreatedSkillInfos}
                        />
                        <div style={{ display: "flex" }}>
                            <button
                                className={"btn btn-primary " + styles.create_button}
                                type="submit"
                                data-testid="submit-project-form-button"
                            >
                                {project ? capitalize(t("save project")) : capitalize(t("create project"))}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
