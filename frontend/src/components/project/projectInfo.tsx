import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../../properties/apiPaths";
import { capitalize } from "../../utility/stringUtil";
import useFullProjectInfo from "../../hooks/useFullProjectInfo";
import { emptyProject } from "../../api/entities/ProjectEntity";
import ProjectSkillStudent from "./projectSkillStudent";
import styles from "../../styles/projects/projectInfo.module.css";

export function ProjectInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query as { id: string };

    const { data, error } = useFullProjectInfo(apiPaths.projects + "/" + id);

    if (error || !data) {
        return null;
    }

    const info = data.info || emptyProject;
    const projectSkills = data.skills;
    const coaches = data.coaches;

    return (
        <div className={styles.project_info}>
            <h1>{info.name}</h1>
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
        </div>
    );
}
