import styles from "../styles/projectInfo.module.css";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IProject } from "../api/entities/ProjectEntity";
import { getProjectOnUrl } from "../api/calls/projectCalls";
import apiPaths from "../properties/apiPaths";
import { IUser } from "../api/entities/UserEntity";
import { getAllUsersFormLinks } from "../api/calls/userCalls";
import { IProjectSkill, ProjectSkill } from "../api/entities/ProjectSkillEntity";
import { getAllProjectSkillsFormLinks } from "../api/calls/projectSkillCalls";
import { IStudent } from "../api/entities/StudentEntity";

interface IFullProjectInfo {
    info: IProject;
    coaches: IUser[];
    skills: IProjectSkill[];
}

interface IFullProjectSkill {
    skill: IProjectSkill;
    assignee: IStudent;
}

export function ProjectInfo() {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [project, setProject] = useState<IFullProjectInfo | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const project: IProject = await getProjectOnUrl(apiPaths.projects + "/" + id);
            const coaches: IUser[] = await getAllUsersFormLinks(project._links.coaches.href);
            const neededSkills: IProjectSkill[] = await getAllProjectSkillsFormLinks(
                project._links.neededSkills.href
            );
            setProject(undefined);
        };
        fetchData().catch(console.log);
    });

    if (!project) {
        return null;
    }

    return (
        <div className={styles.project_info}>
            <h1>{project.info.name}</h1>
            <a href={project.info.partnerWebsite}>{project.info.partnerName}</a>
            Coach: {project.info.name}
        </div>
    );
}
