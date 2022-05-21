import { IAssignment } from "../../api/entities/AssignmentEntity";
import useSWR from "swr";
import { getProjectSkillOnUrl } from "../../api/calls/projectSkillCalls";
import { useEffect } from "react";
import { getStudentOnUrl } from "../../api/calls/studentCalls";

export interface StudentAssignmentRegisterProps {
    registerAssignment: (studentUrl: string, assigmentUrl: string) => void;
    removeAssignment: (assignmentUrl: string) => void;
    assignment: IAssignment;
}

export default function StudentAssignmentRegister({ assignment, registerAssignment, removeAssignment }: StudentAssignmentRegisterProps) {
    const { data: receivedStudent, error: studentError } = useSWR(
        assignment._links.student.href,
        getStudentOnUrl
    );

    const receivedStudentUrl = receivedStudent?._links.self.href;
    const assignmentUrl = assignment._links.self.href;
    const hasErrored = !!studentError;

    useEffect(() => {
        if (receivedStudentUrl) {
            registerAssignment(receivedStudentUrl, assignmentUrl);
        } else if (hasErrored) {
            // Let us hope this doesn't happen too often
            removeAssignment(assignmentUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedStudentUrl, assignmentUrl, hasErrored]);

    return null;
}