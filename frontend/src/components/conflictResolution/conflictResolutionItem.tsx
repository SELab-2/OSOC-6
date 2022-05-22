import { IStudent } from "../../api/entities/StudentEntity";
import { Form, Formik } from "formik";
import useSWR, { useSWRConfig } from "swr";
import {
    getAllAssignmentsFromPage,
    getValidAssignmentsUrlForStudent,
    invalidateAssignment,
} from "../../api/calls/AssignmentCalls";
import { useState } from "react";
import ConflictResolutionRadioButton from "./conflictResolutionRadioButton";
import { IAssignment } from "../../api/entities/AssignmentEntity";
import { capitalize } from "../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import ProjectSkillRegister from "./projectSkillRegister";
import styles from "../../styles/conflicts.module.css";
import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSwrForEntityList } from "../../hooks/utilHooks";
import { useValidAssignmentsFromStudentList } from "../../hooks/useValidAssignmentsFromStudentList";
import useConflictStudents from "../../hooks/useConflictStudents";

/**
 * Type that will hold the projectSkills and its assignments.
 */
export type ProjectMapper = {
    // Maps projectSkill to the assignments
    [projectSkill: string]: Set<string>;
};

/**
 * Properties needed by [ConflictResolutionItem].
 */
export interface ConflictResolutionItemProps {
    student: IStudent;
}
/**
 * Component representing one student in the conflict resolution list.
 * @param student the student that this resolution is all about.
 */

export default function ConflictResolutionItem({ student }: ConflictResolutionItemProps) {
    const { t } = useTranslation("common");
    const currentUserIsAdmin = useCurrentAdminUser();
    const {
        data: receivedAssignments,
        error: assignmentsError,
        mutate: studentsAssignmentMutate,
    } = useValidAssignmentsFromStudentList(student._links.self.href);
    const { data: conflictStudents, mutate: mutateConflictStudents } = useConflictStudents();

    // Mutation boolean is needed because we are changing the projectSkillMapper in place.
    // Changing projectSkillMapper in place is needed because of closures.
    const [mutated, setMutated] = useState<boolean>(false);
    const [projectSkillMapper, setProjectSkillMapper] = useState<ProjectMapper>({});
    const [lastPicked, setLastPicked] = useState("");
    const { mutate } = useSWRConfig();

    if (assignmentsError) {
        console.log(assignmentsError);
        return null;
    }

    function registerAssignment(projectUrl: string, assignmentUrl: string): void {
        if (!(projectUrl in projectSkillMapper)) {
            projectSkillMapper[projectUrl] = new Set();
        }
        projectSkillMapper[projectUrl].add(assignmentUrl);
        setProjectSkillMapper(projectSkillMapper);
        setMutated(true);
    }

    function removeAssignment(assignmentUrl: string): void {
        // The values need to be get here because it needs to be the values at this moment and not in closure creation.
        for (const assignments of Object.values(projectSkillMapper)) {
            assignments.delete(assignmentUrl);
        }
        setProjectSkillMapper(projectSkillMapper);
        setMutated(true);
    }

    if (mutated) {
        setMutated(false);
    }

    const assignments: IAssignment[] = receivedAssignments || [];

    async function submitHandler(picked: string) {
        if (picked) {
            setLastPicked(picked);
            const assignmentsToInvalidate = Object.entries(projectSkillMapper)
                .filter(([skillUrl]) => skillUrl !== picked)
                .flatMap(([, assignments]) => Array.from(assignments));

            if (conflictStudents) {
                mutateConflictStudents(
                    conflictStudents.filter(
                        (filterStud) => filterStud._links.self.href !== student._links.self.href
                    )
                ).catch(console.log);
            }
            if (receivedAssignments) {
                studentsAssignmentMutate(
                    receivedAssignments.filter(
                        (assign) => !assignmentsToInvalidate.includes(assign._links.self.href)
                    )
                ).catch(console.log);
            }
            await Promise.all([
                ...assignmentsToInvalidate.map((assignment) => invalidateAssignment(assignment)),
            ]);
        } else {
            // Will be refactored so keeping the hard coded string.
            alert(capitalize(t("conflict decision")));
        }
    }

    return (
        <div className={styles.conflict_inner_div} key={student._links.self.href}>
            {
                // Render an empty component that performs a callback to a state.
                // Later render the children using that state.
                assignments.map((assignment) => (
                    <ProjectSkillRegister
                        registerAssignment={registerAssignment}
                        removeAssignment={removeAssignment}
                        assignment={assignment}
                        picked={lastPicked}
                        key={assignment._links.self.href}
                    />
                ))
            }
            <h6>{student.callName}</h6>
            <Formik
                initialValues={{
                    picked: "",
                }}
                onSubmit={async ({ picked }) => submitHandler(picked)}
            >
                <Form>
                    <div role="group">
                        {
                            // Sort for consistency
                            Object.entries(projectSkillMapper)
                                .sort(([projSkillA], [projSkillB]) => projSkillA.localeCompare(projSkillB))
                                .map(([projectSkillUrl, assignments]) => (
                                    <ConflictResolutionRadioButton
                                        key={projectSkillUrl}
                                        projectSkill={projectSkillUrl}
                                        assignments={Array.from(assignments)}
                                        fieldName={"picked"}
                                    />
                                ))
                        }
                    </div>
                    {currentUserIsAdmin && (
                        <button
                            className="btn btn-outline-primary"
                            data-testid="conflicts-submit"
                            type="submit"
                        >
                            {capitalize(t("confirm"))}
                        </button>
                    )}
                </Form>
            </Formik>
        </div>
    );
}
