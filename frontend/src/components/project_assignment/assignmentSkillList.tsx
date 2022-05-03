import { Container } from "react-bootstrap";
import AssignmentItem from "./assignmentItem";
import useSWR, { useSWRConfig } from "swr";
import { getAllProjectSkillsFromLinks } from "../../api/calls/projectSkillCalls";
import WarningToast from "../warningToast";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { IProject } from "../../api/entities/ProjectEntity";
import { DropHandler } from "../../pages/assignStudents";
import { getSkillTypeFromSkill } from "../../api/calls/skillTypeCalls";
import { IProjectSkill } from "../../api/entities/ProjectSkillEntity";

/**
 * This class returns a sorted list of all the skills appointed to a project.
 * @param props Properties
 * @constructor
 */
export default function AssignmentSkillList(props: { project: IProject; dropHandler: DropHandler }) {
    const { t } = useTranslation("common");

    const { mutate } = useSWRConfig();
    let { data, error } = useSWR(props.project._links.neededSkills.href, getAllProjectSkillsFromLinks);

    if (error) {
        return <WarningToast message={capitalize(t("error reload page"))} />;
    }

    async function dropStudent(studentName: string, studentUrl: string, skill: IProjectSkill) {
        const skillType = await getSkillTypeFromSkill(skill);
        const skillColor = skillType.colour;
        props.dropHandler(
            studentName,
            studentUrl,
            { skillUrl: skill._links.self.href, skillName: skill.name, skillColor },
            props.project.name
        );
        await mutate(props.project._links.neededSkills.href);
    }

    let skillList = data || [];

    skillList.sort((skill1, skill2) => {
        if (skill1.name > skill2.name) {
            return 1;
        }

        if (skill1.name < skill2.name) {
            return -1;
        }

        return 0;
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
