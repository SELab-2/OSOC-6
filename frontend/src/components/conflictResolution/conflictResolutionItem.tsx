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
    const assignmentsUrl = getValidAssignmentsUrlForStudent(student);
    const { data: receivedAssignments, error: assignmentsError } = useSWR(
        assignmentsUrl,
        getAllAssignmentsFromPage
    );

    // Mutation boolean is needed because we are changing the projectSkillMapper in place.
    // Changing projectSkillMapper in place is needed because of closures.
    const [mutated, setMutated] = useState<boolean>(false);
    const [projectSkillMapper, setProjectSkillMapper] = useState<ProjectMapper>({});
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

    // Sort for consistency
    const assignments: IAssignment[] = receivedAssignments || [];

    // we can mutate on the assignments, so they are known to swr. (This might result in mutation overload?)
    Promise.all(assignments.map((assignment) => mutate(assignment._links.self.href, assignment))).catch(
        console.log
    );

    return (
        <div key={student._links.self.href}>
            {
                // Render an empty component that performs a callback to a state.
                // Later render the children using that state.
                assignments.map((assignment) => (
                    <ProjectSkillRegister
                        registerAssignment={registerAssignment}
                        removeAssignment={removeAssignment}
                        assignment={assignment}
                        key={assignment._links.self.href}
                    />
                ))
            }
            <div>{student.callName}</div>
            <Formik
                initialValues={{
                    picked: "",
                }}
                onSubmit={async ({ picked }) => {
                    if (picked) {
                        await Promise.all([
                            ...Object.entries(projectSkillMapper)
                                .filter(([skillUrl]) => skillUrl !== picked)
                                .flatMap(([, assignments]) => Array.from(assignments))
                                .map((assignment) => invalidateAssignment(assignment)),
                            mutate(assignmentsUrl),
                        ]);
                    } else {
                        // Will be refactored so keeping the hard coded string.
                        alert("pick a skill to keep the student on");
                    }
                }}
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

                    <button type="submit">{capitalize(t("confirm"))}</button>
                </Form>
            </Formik>
        </div>
    );
}
