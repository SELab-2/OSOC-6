import { emptyAssignment, IAssignment } from "../../api/entities/AssignmentEntity";
import useSWR from "swr";
import { getAssignmentOnUrl } from "../../api/calls/AssignmentCalls";
import { getProjectSkillOnUrl } from "../../api/calls/projectSkillCalls";
import { getProjectOnUrl } from "../../api/calls/projectCalls";
import { emptyProjectSkill, IProjectSkill } from "../../api/entities/ProjectSkillEntity";
import { emptyProject, IProject } from "../../api/entities/ProjectEntity";
import { Field } from "formik";
import SkillBadge from "../util/skillBadge";

export interface ConflictResolutionRadioButtonProps {
    projectSkill: string;
    assignments: string[];
    fieldName: string;
}

function AssignmentReasonMapper({ assignmentUrl }: { assignmentUrl: string }) {
    const { data: receivedAssignment, error: assignmentError } = useSWR(assignmentUrl, getAssignmentOnUrl);

    if (assignmentError) {
        console.log(assignmentError);
        return null;
    }

    const assignment: IAssignment = receivedAssignment || emptyAssignment;

    return <>{assignment.reason}</>;
}

export default function ConflictResolutionRadioButton({
    projectSkill,
    fieldName,
    assignments,
}: ConflictResolutionRadioButtonProps) {
    const { data: receivedSkill, error: skillError } = useSWR(projectSkill, getProjectSkillOnUrl);
    const { data: receivedProject, error: projectError } = useSWR(
        receivedSkill ? receivedSkill._links.project.href : null,
        getProjectOnUrl
    );

    if (skillError || projectError) {
        console.log(skillError || projectError);
        return null;
    }

    const skill: IProjectSkill = receivedSkill || emptyProjectSkill;
    const project: IProject = receivedProject || emptyProject;

    return (
        <div>
            <label>
                <Field
                    type="radio"
                    name={fieldName}
                    id={skill._links.self.href}
                    value={skill._links.self.href}
                />
                {project.name} <SkillBadge skill={skill.name} />
                <div>
                    Reason(s):
                    {assignments.map((assignmentUrl) => (
                        <AssignmentReasonMapper assignmentUrl={assignmentUrl} key={assignmentUrl} />
                    ))}
                </div>
            </label>
        </div>
    );
}
