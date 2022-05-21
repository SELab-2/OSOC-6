import { IProjectSkill } from "../../api/entities/ProjectSkillEntity";
import useSWR, { useSWRConfig } from "swr";
import {
    deleteAssignment,
    getAllAssignmentsFromPage,
    getValidAssignmentsUrlForProjectSkill,
} from "../../api/calls/AssignmentCalls";
import WarningToast from "../util/warningToast";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { IAssignment } from "../../api/entities/AssignmentEntity";
import StudentAssignmentsRow from "./studentAssignmentsRow";
import SkillBadge from "../util/skillBadge";
import { useState } from "react";
import { ProjectMapper } from "../conflictResolution/conflictResolutionItem";
import StudentAssignmentRegister from "./studentAssignmentRegister";

/**
 * Type that will hold the projectSkills and its assignments.
 */
export type StudentMapper = {
    // Maps Students to the assignments
    [projectSkill: string]: Set<string>;
};

/**
 * Properties needed by [ProjectSkillItem].
 */
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
function ProjectSkillItem({ skill }: IAssignmentItemProps) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();
    const assignmentsUrl = getValidAssignmentsUrlForProjectSkill(skill);
    const { data: receivedAssignments, error: assignmentsError } = useSWR(
        assignmentsUrl,
        getAllAssignmentsFromPage
    );

    // Mutation boolean is needed because we are changing the projectSkillMapper in place.
    // Changing studentSkillMapper in place is needed because of closures.
    const [mutated, setMutated] = useState<boolean>(false);
    const [studentSkillMapper, setStudentSkillMapper] = useState<StudentMapper>({});

    const assignments: IAssignment[] = receivedAssignments || [];

    function registerAssignment(studentUrl: string, assignmentUrl: string): void {
        if (!(studentUrl in studentSkillMapper)) {
            studentSkillMapper[studentUrl] = new Set();
        }
        studentSkillMapper[studentUrl].add(assignmentUrl);
        setStudentSkillMapper(studentSkillMapper);
        setMutated(true);
    }

    function removeAssignment(assignmentUrl: string): void {
        // The values need to be get here because it needs to be the values at this moment and not in closure creation.
        for (const assignments of Object.values(studentSkillMapper)) {
            assignments.delete(assignmentUrl);
        }
        setStudentSkillMapper(studentSkillMapper);
        setMutated(true);
    }

    async function deleteAssignmentCallback(assignmentUrl: string) {
        const newAssignments = await deleteAssignment(assignmentUrl, assignments);
        await mutate(assignmentsUrl, newAssignments);
    }

    if (mutated) {
        setMutated(false);
    }

    if (assignmentsError) {
        return <WarningToast message={capitalize(t("error reload page"))} />;
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
            {   // Render an empty component that performs a callback to a state.
                // Later render the children using that state.
                assignments.map(assignment =>
                    <StudentAssignmentRegister
                        registerAssignment={registerAssignment}
                        removeAssignment={removeAssignment}
                        assignment={assignment}
                        key={assignment._links.self.href}
                    />
                )
            }
            <SkillBadge skill={skill.name} />
            { Object.entries(studentSkillMapper)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([studentUrl, assignments]) => (
                    <div key={studentUrl}>
                        <StudentAssignmentsRow
                            studentUrl={studentUrl}
                            assignments={Array.from(assignments)}
                            removeCallback={deleteAssignmentCallback}
                        />
                        <hr />
                    </div>
                ))}
        </div>
    );
}

export default ProjectSkillItem;
