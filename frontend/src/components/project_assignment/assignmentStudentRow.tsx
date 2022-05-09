import { CloseButton, Col, Row } from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import { extractIdFromStudentUrl } from "../../api/calls/studentCalls";
import { capitalize } from "../../utility/stringUtil";
import { IAssignment } from "../../api/entities/AssignmentEntity";
import useSWR, { mutate } from "swr";
import useTranslation from "next-translate/useTranslation";
import { emptyStudent, IStudent } from "../../api/entities/StudentEntity";
import { emptyUser, IUser } from "../../api/entities/UserEntity";
import { deleteAssignment, extractIdFromAssignmentUrl } from "../../api/calls/AssignmentCalls";

interface IAssignmentStudentProps {
    assignment: IAssignment;
    removeCallback: (assignmentUrl: string) => Promise<void>;
}

export default function AssignmentStudentRow({ assignment, removeCallback }: IAssignmentStudentProps) {
    const { t } = useTranslation("common");
    const { data: resStudent, error: studentError } = useSWR(assignment._links.student.href);
    const { data: resAssigner, error: assignerError } = useSWR(assignment._links.assigner.href);

    if (studentError || assignerError) {
        console.log(studentError || assignerError);
        return null;
    }

    const student: IStudent = resStudent || emptyStudent;
    const assigner: IUser = resAssigner || emptyUser;

    async function removeAssignment(event: any) {
        await removeCallback(event.target.value);
    }

    return (
        <Row className={"align-items-center"}>
            <Col xs={10} md={11}>
                <a
                    rel="noreferrer"
                    href={applicationPaths.students + "/" + extractIdFromStudentUrl(student._links.self.href)}
                    target="_blank"
                >
                    <h6>{student.firstName}</h6>
                </a>
                <p>
                    {capitalize(t("suggested by"))}
                    {assigner.callName}: <br /> {assignment.reason}
                </p>
            </Col>
            <Col xs={2} md={1}>
                <CloseButton
                    aria-label={"Remove student from project"}
                    value={assignment._links.self.href}
                    onClick={(assignment) => removeAssignment(assignment)}
                    data-testid={
                        "remove assignment button " + extractIdFromAssignmentUrl(assignment._links.self.href)
                    }
                />
            </Col>
        </Row>
    );
}
