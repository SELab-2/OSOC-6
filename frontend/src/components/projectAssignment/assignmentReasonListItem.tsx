import useSWR from "swr";
import { getUserOnUrl } from "../../api/calls/userCalls";
import { extractIdFromAssignmentUrl, getAssignmentOnUrl } from "../../api/calls/AssignmentCalls";
import { emptyAssignment } from "../../api/entities/AssignmentEntity";
import { emptyUser } from "../../api/entities/UserEntity";
import { capitalize } from "../../utility/stringUtil";
import styles from "../../styles/assignments.module.css";
import { CloseButton } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";

export interface AssignmentReasonListItemProps {
    assignmentUrl: string;
    removeCallback: (assignmentUrl: string) => Promise<void>;
}

export default function AssignmentReasonListItem({
    assignmentUrl,
    removeCallback,
}: AssignmentReasonListItemProps) {
    const { t } = useTranslation("common");

    const { data: receivedAssignment, error: assignmentError } = useSWR(assignmentUrl, getAssignmentOnUrl);

    const { data: receivedAssigner, error: assignerError } = useSWR(
        receivedAssignment ? receivedAssignment._links.assigner.href : null,
        getUserOnUrl
    );

    if (assignmentError || assignerError) {
        console.log(assignmentError || assignerError);
        return null;
    }

    const assignment = receivedAssignment || emptyAssignment;
    const assigner = receivedAssigner || emptyUser;

    return (
        <>
            <h6>
                {capitalize(t("suggested by"))} {assigner.callName}:
            </h6>
            <p>{assignment.reason}</p>
            <CloseButton
                aria-label={"Remove student from project"}
                value={assignment._links.self.href}
                onClick={(assignment: any) => removeCallback(assignment.target.value)}
                data-testid={"remove-assignment-button-" + assignment.reason}
                className={styles.close_button}
            />
        </>
    );
}
