import { IAssignment } from "../../api/entities/AssignmentEntity";
import useSWR, { mutate, useSWRConfig } from "swr";
import { getProjectSkillOnUrl } from "../../api/calls/projectSkillCalls";
import { useEffect } from "react";
import useValidAssignmentsFromProjectSkillList from "../../hooks/useValidAssignmentsFromProjectSkillList";

/**
 * Properties needed by [ProjectSkillRegister].
 */
export interface ProjectSkillRegisterProps {
    registerAssignment: (projectSkillUrl: string, assigmentUrl: string) => void;
    removeAssignment: (assignmentUrl: string) => void;
    assignment: IAssignment;
    picked: string;
}

/**
 * Component registering assignments and the projectsSkill they belong to. Needed as a workaround for rules of hooks.
 * @param registerAssignment callBack registering so the component can register itself.
 * @param removeAssignment callback removing the current assignment.
 * @param assignment the assignment the hook handles.
 */
export default function ProjectSkillRegister({
    registerAssignment,
    removeAssignment,
    assignment,
    picked,
}: ProjectSkillRegisterProps) {
    const { data: receivedSkill, error: skillError } = useSWR(
        assignment._links.projectSkill.href,
        getProjectSkillOnUrl
    );
    const { mutate } = useSWRConfig();

    const receivedProjectSkillUrl = receivedSkill?._links.self.href;
    const assignmentUrl = assignment._links.self.href;
    const hasErrored = !!skillError;

    useEffect(() => {
        if (picked && receivedSkill?._links?.assignments?.href) {
            mutate(receivedSkill?._links?.assignments?.href).catch(console.log);
        }
    }, [picked, receivedSkill?._links?.assignments?.href]);

    useEffect(() => {
        if (receivedProjectSkillUrl) {
            registerAssignment(receivedProjectSkillUrl, assignmentUrl);
        } else if (hasErrored) {
            // Let us hope this doesn't happen too often
            removeAssignment(assignmentUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedProjectSkillUrl, assignmentUrl, hasErrored]);

    return null;
}
