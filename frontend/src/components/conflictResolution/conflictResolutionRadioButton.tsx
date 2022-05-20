import { emptyAssignment, IAssignment } from '../../api/entities/AssignmentEntity';
import useSWR from 'swr';
import { getAssignmentOnUrl } from '../../api/calls/AssignmentCalls';
import { getProjectSkillOnUrl } from '../../api/calls/projectSkillCalls';
import { getProjectOnUrl } from '../../api/calls/projectCalls';
import { emptyProjectSkill, IProjectSkill } from '../../api/entities/ProjectSkillEntity';
import { emptyProject, IProject } from '../../api/entities/ProjectEntity';
import { Field } from 'formik';
import SkillBadge from '../util/skillBadge';
import { capitalize } from '../../utility/stringUtil';
import useTranslation from 'next-translate/useTranslation';
import styles from '../../styles/conflicts.module.css';

/**
 * List item representation of an assignment. Just shows the reason of the assignment.
 * @param assignmentUrl the url hosting the assignment.
 */
function AssignmentReasonListItem({ assignmentUrl }: { assignmentUrl: string }) {
    const { data: receivedAssignment, error: assignmentError } = useSWR(assignmentUrl, getAssignmentOnUrl);

    if (assignmentError) {
        console.log(assignmentError);
        return null;
    }

    const assignment: IAssignment = receivedAssignment || emptyAssignment;

    return <li>{assignment.reason}</li>;
}

/**
 * Properties needed by [ConflictResolutionRadioButton].
 */
export interface ConflictResolutionRadioButtonProps {
    projectSkill: string;
    assignments: string[];
    fieldName: string;
}

/**
 * Single radio button in the conflict resolution.
 * Radio button representation of an [IProjectSkill] the conflicting student is assigned to.
 * @param projectSkill the projectSkill that this button represents
 * @param fieldName the Formik fieldName.
 * @param assignments the list of assignments as Urls that assign over this projectSkill.
 */
export default function ConflictResolutionRadioButton({
    projectSkill,
    fieldName,
    assignments,
}: ConflictResolutionRadioButtonProps) {
    const { t } = useTranslation("common");
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
        <>
            <div className={styles.conflict_div_button_and_project}>
                <Field
                    type="radio"
                    className={styles.conflict_radio_button}
                    name={fieldName}
                    id={skill._links.self.href}
                    value={skill._links.self.href}
                    data-testid={"radio-conflict-" + skill._links.self.href}
                />
                <p className={styles.conflict_project_name}>{project.name}</p>
                <SkillBadge skill={skill.name} />
            </div>
            <div className={styles.conflict_reasons}>
                <p>{capitalize(t("reason(s)"))}:</p>
                <ul className={styles.conflict_reasons_list}>
                    {assignments
                        .sort((a, b) => a.localeCompare(b))
                        .map((assignmentUrl) => (
                            <AssignmentReasonListItem assignmentUrl={assignmentUrl} key={assignmentUrl} />
                        ))}
                </ul>
            </div>
        </>
    );
}
