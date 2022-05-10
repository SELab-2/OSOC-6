import { IProjectSkill } from "../../api/entities/ProjectSkillEntity";
import { Badge } from "react-bootstrap";
import useSWR, { useSWRConfig } from "swr";
import { deleteAssignment, getAllAssignmentsFormLinks } from "../../api/calls/AssignmentCalls";
import WarningToast from "../warningToast";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import useSkillTypeByName from "../../hooks/useSkillTypeByName";
import { emptySkillType, ISkillType } from "../../api/entities/SkillTypeEntity";
import { IAssignment } from "../../api/entities/AssignmentEntity";
import AssignmentStudentRow from "./assignmentStudentRow";
import { useState } from "react";
import SkillBadge from "../skillBadge";

export interface IAssignmentItemProps {
    skill: IProjectSkill;
}

/**
 * Custom sort function for assignment items.
 * It sorts the assignments on the students first name,
 * if the students have the same name we sort on the username of the assigner.
 * @param assignments list of [IAssignment] that should be sorted in place.
 * @param keyHolder the keyHolder object that enables the sort on fields not contained within [IAssignment].
 */
function sortAssignments(assignments: IAssignment[], keyHolder: IStudentAssignmentSortKeyHolder) {
    assignments.sort((assign1, assign2) => {
        const key1 = keyHolder[assign1._links.self.href];
        const key2 = keyHolder[assign2._links.self.href];

        if (key1 === undefined) {
            if (key2 === undefined) {
                return 0;
            }
            return -1;
        } else if (key2 === undefined) {
            return 1;
        }

        const compareStudents: number = key1.studentFirstName.localeCompare(key2.studentFirstName);
        if (compareStudents === 0) {
            return key1.assignerCallName.localeCompare(key2.assignerCallName);
        }
        return compareStudents;
    });
}

export interface IAssignmentSortKey {
    studentFirstName: string;
    assignerCallName: string;
}

interface IStudentAssignmentSortKeyHolder {
    [k: string]: IAssignmentSortKey | undefined;
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
    const { data: resAssignments, error: assignmentsError } = useSWR(
        skill._links.assignments.href,
        getAllAssignmentsFormLinks
    );

    // We use mutated state because we can not copy the holder object and trigger a rerender from the holder.
    // The closure in function makes this impossible.
    // using the mutated boolean state we can force a rerender from within the child component.
    const [mutated, setMutated] = useState<boolean>(false);
    const [sortKeyHolder, setSortKeyHolder] = useState<IStudentAssignmentSortKeyHolder>({});

    function registerSortKey(assignment: IAssignment, sortKey: IAssignmentSortKey) {
        sortKeyHolder[assignment._links.self.href] = sortKey;
        setSortKeyHolder(sortKeyHolder);
        setMutated(true);
    }

    if (mutated) {
        setMutated(false);
    }

    if (assignmentsError) {
        return <WarningToast message={capitalize(t("error reload page"))} />;
    }

    const assignments: IAssignment[] = resAssignments || [];
    sortAssignments(assignments, sortKeyHolder);

    async function removeAssignment(assignmentUrl: string) {
        const newAssignments = await deleteAssignment(assignmentUrl, assignments);
        await mutate(skill._links.assignments.href, newAssignments);
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
            {assignments.map((assignment) => (
                <div key={assignment._links.self.href}>
                    <AssignmentStudentRow
                        assignment={assignment}
                        removeCallback={removeAssignment}
                        registerSortKey={registerSortKey}
                    />
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default AssignmentItem;
