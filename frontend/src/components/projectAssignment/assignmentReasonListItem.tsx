import useSWR from "swr";
import { getUserOnUrl } from "../../api/calls/userCalls";
import { getAssignmentOnUrl } from "../../api/calls/AssignmentCalls";
import { emptyAssignment } from "../../api/entities/AssignmentEntity";
import { emptyUser } from "../../api/entities/UserEntity";
import { capitalize } from "../../utility/stringUtil";
import styles from "../../styles/assignments.module.css";
import { CloseButton } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import { useCurrentAdminUser, useCurrentUser } from "../../hooks/useCurrentUser";

export interface AssignmentReasonListItemProps {
    assignmentUrl: string;
    removeCallback: (assignmentUrl: string) => Promise<void>;
}

export default function AssignmentReasonListItem({
    assignmentUrl,
    removeCallback,
}: AssignmentReasonListItemProps) {
    const { t } = useTranslation("common");
    const isAdmin = useCurrentAdminUser();

    const { data: receivedAssignment, error: assignmentError } = useSWR(assignmentUrl, getAssignmentOnUrl);

    const { data: receivedAssigner, error: assignerError } = useSWR(
        receivedAssignment ? receivedAssignment._links.assigner.href : null,
        getUserOnUrl
    );

    const { user: currentUser, error: userError } = useCurrentUser();

    if (assignmentError || assignerError || userError) {
        console.log(assignmentError || assignerError || userError);
        return null;
    }

    const assignment = receivedAssignment || emptyAssignment;
    const assigner = receivedAssigner || emptyUser;

    return (
        <div className={styles.assignment_item_div}>
            <div className={styles.assignment_reason_div}>
                <h6>
                    {capitalize(t("suggested by"))} {assigner.callName}:
                </h6>
                <p>{assignment.reason}</p>
            </div>
            {(isAdmin || assigner.email === currentUser?.email) && (
                <CloseButton
                    aria-label={"Remove student from project"}
                    value={assignment._links.self.href}
                    onClick={(assignment: any) => {
                        const result = confirm(capitalize(t("confirm delete assignment")));
                        if (result) {
                            removeCallback(assignment.target.value).then(console.log);
                        }
                    }}
                    data-testid={"remove-assignment-button-" + assignment.reason}
                    className={styles.close_button}
                />
            )}
        </div>
    );
}
