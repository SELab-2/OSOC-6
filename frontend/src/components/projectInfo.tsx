import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../properties/apiPaths";
import useSWR from "swr";
import { getFullProjectInfo } from "../api/calls/projectCalls";
import { capitalize } from "../utility/stringUtil";

export function ProjectInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query as { id: string };

    const { data, error } = useSWR(apiPaths.projects + "/" + id, getFullProjectInfo);

    if (error || !data) {
        return null;
    }

    return (
        <div>
            <h1>{data.info.name}</h1>
            <a href={data.info.partnerWebsite || undefined}>{data.info.partnerName}</a>
            <br />
            {capitalize(t("coaches"))}
            <ul>
                {data.coaches.map((user) => (
                    <li key={user._links.self.href}>{user.callName}</li>
                ))}
            </ul>
            <hr />
            {capitalize(t("project about"))}
            <br />
            {data.info.info}
            <hr />
            {capitalize(t("project expertise"))}
            <ul>
                {data.skills.map((skill) => (
                    <li key={skill.skill._links.self.href}>
                        {skill.skill.name + ": " + skill.skill.additionalInfo}
                    </li>
                ))}
            </ul>
            {capitalize(t("project roles"))}
            <ul>
                {data.skills.map((skill) => (
                    <li style={{ color: skill.type.colour }} key={skill.skill._links.self.href}>
                        {skill.type.name}
                        <ul>
                            {skill.assignees.map((student) => (
                                <li key={student._links.self.href}>{student.callName}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
