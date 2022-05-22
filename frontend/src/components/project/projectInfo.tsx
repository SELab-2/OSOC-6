import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";
import apiPaths from "../../properties/apiPaths";
import {capitalize} from "../../utility/stringUtil";
import useFullProjectInfo from "../../hooks/useFullProjectInfo";
import {emptyProject} from "../../api/entities/ProjectEntity";
import ProjectSkillStudent from "./projectSkillStudent";
import styles from "../../styles/projects/projectInfo.module.css";
import {useState} from "react";
import {StatusCodes} from "http-status-codes";
import {getParamsFromQueryUrl, getQueryUrlFromParams} from "../../api/calls/baseCalls";
import applicationPaths from "../../properties/applicationPaths";
import {deleteProject} from "../../api/calls/projectCalls";
import {Toast, ToastContainer} from "react-bootstrap";
import timers from "../../properties/timers";
import Image from "next/image";
import {ConfirmDeleteButton} from "../util/confirmDeleteButton";

export function ProjectInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [show, setShow] = useState<boolean>(true);

    const { data, error } = useFullProjectInfo(apiPaths.projects + "/" + id);

    if (error || !data) {
        return null;
    }

    const info = data.info || emptyProject;
    const projectSkills = data.skills;
    const coaches = data.coaches;

    async function deleteProjectOnClick() {
        const response = await deleteProject(info._links.self.href);
        if (response.status == StatusCodes.NO_CONTENT) {
            try {
                const params = getParamsFromQueryUrl(router.asPath);
                await router.push(getQueryUrlFromParams("/" + applicationPaths.projects, params));
            } catch (error) {
                setShow(true);
            }
        } else {
            setShow(true);
        }
    }

    async function editProject() {
        await router.push("/" + applicationPaths.projects + "/" + id + "/edit");
    }

    return (
        <div className={styles.project_info}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>{info.name}</h1>
                <div>
                    <a
                        style={{ margin: "1rem", cursor: "pointer" }}
                        onClick={editProject}
                        data-testid="edit-project"
                    >
                        <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                    </a>
                    <ConfirmDeleteButton dataTestId="delete-project" handler={deleteProjectOnClick}/>
                </div>
            </div>
            <h5>
                <a href={info.partnerWebsite || undefined}>{info.partnerName}</a>
            </h5>
            <h6 className={styles.space_top}>{capitalize(t("coaches"))}</h6>
            <ul>
                {coaches.length !== 0 ? (
                    coaches.map((user) => <li key={user._links.self.href}>{user.callName}</li>)
                ) : (
                    <p>{capitalize(t("no coaches for project"))}</p>
                )}
            </ul>

            <hr className={styles.space} />
            <h4>{capitalize(t("project about"))}</h4>
            <div>{info.info}</div>
            <ul>
                {info.goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                ))}
            </ul>

            <hr className={styles.space} />
            <h4>{capitalize(t("project expertise"))}</h4>
            <ul>
                {projectSkills.length !== 0 ? (
                    projectSkills.map((skill) => (
                        <li key={skill._links.self.href}>{skill.name + ": " + skill.additionalInfo}</li>
                    ))
                ) : (
                    <p>{capitalize(t("no extra requirements for project"))}</p>
                )}
            </ul>

            <h4 className={styles.space_top}>{capitalize(t("project roles"))}</h4>
            <ul>
                {projectSkills.length !== 0 ? (
                    projectSkills.map((skill) => (
                        <ProjectSkillStudent projectSkill={skill} key={skill._links.self.href} />
                    ))
                ) : (
                    <p>{capitalize(t("no roles assigned to project"))}</p>
                )}
            </ul>

            <ToastContainer position="bottom-end">
                <Toast
                    bg="warning"
                    data-testid="warning"
                    onClose={() => setShow(false)}
                    show={show}
                    delay={timers.toast}
                    autohide
                >
                    <Toast.Body>{capitalize(t("something went wrong"))}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}
