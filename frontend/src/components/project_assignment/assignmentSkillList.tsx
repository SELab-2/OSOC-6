import { Container } from "react-bootstrap";
import AssignmentItem from "./assignmentItem";
import useSWR, { useSWRConfig } from "swr";
import { getAllProjectSkillsFromLinks } from "../../api/calls/projectSkillCalls";
import WarningToast from "../warningToast";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { DropHandler } from "../../pages/assignStudents";
import { IProjectSkill } from "../../api/entities/ProjectSkillEntity";
import { getProjectOnUrl } from "../../api/calls/projectCalls";
import apiPaths from "../../properties/apiPaths";

/**
 * This class returns a sorted list of all the skills appointed to a project.
 * @param props Properties
 * @constructor
 */
export default function AssignmentSkillList(props: { projectURL: string; dropHandler: DropHandler }) {
    const { t } = useTranslation("common");
    const { t: errort } = useTranslation("errorMessages");

    const { mutate } = useSWRConfig();
    let { data: project, error: projectError } = useSWR(props.projectURL, getProjectOnUrl);
    let { data, error } = useSWR(
        project ? project._links.neededSkills.href : null,
        getAllProjectSkillsFromLinks
    );

    if (error || projectError) {
        return <WarningToast message={capitalize(errort("error reload page"))} />;
    }

    async function dropStudent(studentName: string, studentUrl: string, skill: IProjectSkill) {
        if (project !== undefined) {
            props.dropHandler(
                studentName,
                studentUrl,
                { skillUrl: skill._links.self.href, skillName: skill.name },
                project.name
            );
            await mutate(skill._links.assignments.href);
        }
    }

    let skillList = data || [];

    skillList.sort((skill1, skill2) => {
        return skill1.name.localeCompare(skill2.name);
    });

    if (skillList.length == 0) {
        return <p data-testid="assignment-skill-list">{capitalize(t("no skills for project"))}</p>;
    }

    return (
        <div data-testid="assignment-skill-list">
            {skillList.map((skill, index) => {
                return (
                    <Container
                        key={index}
                        onDrop={(e) => {
                            e.preventDefault();
                            dropStudent(e.dataTransfer.getData("name"), e.dataTransfer.getData("url"), skill);
                        }}
                        onDragOver={(event) => {
                            event.preventDefault();
                        }}
                        data-testid="dropzone"
                    >
                        <AssignmentItem skill={skill} />
                    </Container>
                );
            })}
        </div>
    );
}
