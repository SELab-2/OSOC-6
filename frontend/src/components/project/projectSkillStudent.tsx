import { IProjectSkill } from "../../api/entities/ProjectSkillEntity";
import useSkillTypeByName from "../../hooks/useSkillTypeByName";
import useSWR from "swr";
import { emptySkillType } from "../../api/entities/SkillTypeEntity";
import { getAllAssignmentsFormLinks } from "../../api/calls/AssignmentCalls";
import { IAssignment } from "../../api/entities/AssignmentEntity";
import { extractIdFromStudentUrl, getStudentOnUrl } from "../../api/calls/studentCalls";
import { emptyStudent } from "../../api/entities/StudentEntity";
import SkillBadge from "../util/skillBadge";
import applicationPaths from "../../properties/applicationPaths";

export interface IProjectSkillStudentProps {
    projectSkill: IProjectSkill;
}

export interface IAssignmentStudentListItemProps {
    assignment: IAssignment;
}

export function AssignmentStudentListItem({ assignment }: IAssignmentStudentListItemProps) {
    let { data: student, error: studentError } = useSWR(assignment._links.student.href, getStudentOnUrl);

    if (studentError) {
        console.log(studentError);
        return null;
    }

    student = student || emptyStudent;
    return (
        <li>
            <a
                rel="noreferrer"
                href={
                    "/" + applicationPaths.students + "/" + extractIdFromStudentUrl(student._links.self.href)
                }
                target="_blank"
            >
                {student.callName}
            </a>
        </li>
    );
}

/**
 * Component showing the project skill with the assigned students.
 * @param projectSkill [IProjectSkill] that is represented by this component.
 */
export default function ProjectSkillStudent({ projectSkill }: IProjectSkillStudentProps) {
    let { data: skillType, error: skillTypeError } = useSkillTypeByName(projectSkill.name);
    let { data: assignments, error: assignmentError } = useSWR(
        projectSkill._links.assignments.href,
        getAllAssignmentsFormLinks
    );

    if (skillTypeError || assignmentError) {
        console.log(skillTypeError || assignmentError);
        return null;
    }

    skillType = skillType || emptySkillType;
    assignments = assignments || [];

    return (
        <li>
            <h6>
                <SkillBadge skill={projectSkill.name} />
            </h6>
            <ul>
                {assignments.map((assignment) => (
                    <AssignmentStudentListItem assignment={assignment} key={assignment._links.self.href} />
                ))}
            </ul>
        </li>
    );
}
