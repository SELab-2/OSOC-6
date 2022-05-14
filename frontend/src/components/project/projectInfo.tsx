import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../../properties/apiPaths";
import useSWR from "swr";
import { capitalize } from "../../utility/stringUtil";
import useFullProjectInfo from "../../hooks/useFullProjectInfo";
import { emptyProject } from "../../api/entities/ProjectEntity";
import ProjectSkillStudent from "./projectSkillStudent";

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
        <div>
            <h1>{info.name}</h1>
            <a href={info.partnerWebsite || undefined}>{info.partnerName}</a>
            <br />
            {capitalize(t("coaches"))}
            <ul>
                {coaches.map((user) => (
                    <li key={user._links.self.href}>{user.callName}</li>
                ))}
            </ul>
            <hr />
            {capitalize(t("project about"))}
            <br />
            {info.info}
            <hr />
            {capitalize(t("project expertise"))}
            <ul>
                {projectSkills.map((skill) => (
                    <li key={skill._links.self.href}>{skill.name + ": " + skill.additionalInfo}</li>
                ))}
            </ul>
            {capitalize(t("project roles"))}
            <ul>
                {projectSkills.map((skill) => (
                    <ProjectSkillStudent projectSkill={skill} key={skill._links.self.href} />
                ))}
            </ul>
        </div>
    );
}
