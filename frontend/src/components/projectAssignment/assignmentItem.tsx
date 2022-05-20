import { IProjectSkill } from '../../api/entities/ProjectSkillEntity';
import useSWR, { useSWRConfig } from 'swr';
import {
    deleteAssignment,
    getAllAssignmentsFromPage,
    getValidAssignmentsUrlForProjectSkill,
} from '../../api/calls/AssignmentCalls';
import WarningToast from '../util/warningToast';
import useTranslation from 'next-translate/useTranslation';
import { capitalize } from '../../utility/stringUtil';
import { IAssignment } from '../../api/entities/AssignmentEntity';
import AssignmentStudentRow from './assignmentStudentRow';
import SkillBadge from '../util/skillBadge';

export interface IAssignmentItemProps {
    skill: IProjectSkill;
}

/**
 * An item containing the information about the assignments to a skill of a project.
 * It contains the name of the skill followed by a list of assignments for that skill.
 * The list contains the first name of the student, the name of the person that did the assignment and the motivation.
 * Furthermore, it contains a delete button to delete the assignment.
 * @param skill [IProjectSkill] you want the assignments from
 * @constructor
 */
function AssignmentItem({ skill }: IAssignmentItemProps) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();
    const assignmentsUrl = getValidAssignmentsUrlForProjectSkill(skill);
    const { data: receivedAssignments, error: assignmentsError } = useSWR(
        assignmentsUrl,
        getAllAssignmentsFromPage
    );

    if (assignmentsError) {
        return <WarningToast message={capitalize(t("error reload page"))} />;
    }

    const assignments: IAssignment[] = receivedAssignments || [];

    async function removeAssignment(assignmentUrl: string) {
        const newAssignments = await deleteAssignment(assignmentUrl, assignments);
        await mutate(assignmentsUrl, newAssignments);
    }

    if (assignments.length === 0) {
        return (
            <div data-testid="assignment-item">
                <SkillBadge skill={skill.name} />
                <p>{capitalize(t("no users for skill"))}</p>
            </div>
        );
    }

    return (
        <div data-testid="assignment-item">
            <SkillBadge skill={skill.name} />
            {assignments
                .sort((a, b) => a._links.self.href.localeCompare(b._links.self.href))
                .map((assignment) => (
                    <div key={assignment._links.self.href}>
                        <AssignmentStudentRow assignment={assignment} removeCallback={removeAssignment} />
                        <hr />
                    </div>
                ))}
        </div>
    );
}

export default AssignmentItem;
