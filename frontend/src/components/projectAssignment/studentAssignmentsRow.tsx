import { CloseButton, Col, Row } from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import { extractIdFromStudentUrl, getStudentOnUrl } from "../../api/calls/studentCalls";
import { capitalize } from "../../utility/stringUtil";
import { IAssignment } from "../../api/entities/AssignmentEntity";
import useSWR from "swr";
import useTranslation from "next-translate/useTranslation";
import { emptyStudent, IStudent } from "../../api/entities/StudentEntity";
import { emptyUser, IUser } from "../../api/entities/UserEntity";
import { extractIdFromAssignmentUrl } from "../../api/calls/AssignmentCalls";
import { getUserOnUrl } from "../../api/calls/userCalls";
import * as loginStyle from "../../styles/loginForm.module.css";
import styles from "../../styles/assignments.module.css";
import AssignmentReasonListItem from "./assignmentReasonListItem";

/**
 * Properties used by [StudentAssignmentsRow].
 */
interface IAssignmentStudentProps {
    studentUrl: string;
    assignments: string[];
    removeCallback: (assignmentUrl: string) => Promise<void>;
    registerInvalidCallback: (assignmentUrl: string) => Promise<void>;
}

export default function StudentAssignmentsRow({
    studentUrl,
    assignments,
    removeCallback,
    registerInvalidCallback,
}: IAssignmentStudentProps) {
    const { data: receivedStudent, error: studentError } = useSWR(studentUrl, getStudentOnUrl);

    const student: IStudent = receivedStudent || emptyStudent;

    if (studentError) {
        console.log(studentError);
        return null;
    }

    return (
        <Row className={"align-items-center"}>
            <Col xs={10} md={11}>
                <a
                    rel="noreferrer"
                    href={applicationPaths.students + "/" + extractIdFromStudentUrl(student._links.self.href)}
                    target="_blank"
                    className={loginStyle.default.link + " " + styles.link_override}
                >
                    <h5>
                        {student.firstName}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-box-arrow-up-right mx-1"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                            />
                            <path
                                fillRule="evenodd"
                                d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                            />
                        </svg>
                    </h5>
                </a>
                {assignments
                    .sort((a, b) => a.localeCompare(b))
                    .map((assignment) => (
                        <AssignmentReasonListItem
                            key={assignment}
                            assignmentUrl={assignment}
                            removeCallback={removeCallback}
                            registerInvalidCallback={registerInvalidCallback}
                        />
                    ))}
            </Col>
        </Row>
    );
}
