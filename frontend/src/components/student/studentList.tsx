import { Button, ListGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import styles from "../../styles/studentList.module.css";
import useTranslation from "next-translate/useTranslation";
import apiPaths from "../../properties/apiPaths";
import {
    constructStudentQueryUrl,
    extractIdFromStudentUrl,
    getAllStudentsFromPage,
    IStudentQueryParams,
} from "../../api/calls/studentCalls";
import { SuggestionCount } from "./suggestionCount";
import { getStudentQueryParamsFromQuery } from "./studentFilterComponent";
import { useEditionApplicationPathTransformer, useSwrWithEdition } from "../../hooks/utilHooks";
import { StudentStatusButton } from "./studentStatusButton";
import { Status } from "../../api/entities/StudentEntity";
import applicationPaths from "../../properties/applicationPaths";
import {useCurrentAdminUser} from "../../hooks/useCurrentUser";

export const StudentList = (props: { isDraggable: boolean; showAdd?: boolean }) => {
    const draggable = props.isDraggable;
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    const params: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);

    const isAdmin = useCurrentAdminUser();

    const { data: receivedStudents, error } = useSwrWithEdition(
        constructStudentQueryUrl(apiPaths.studentByQuery, params),
        getAllStudentsFromPage
    );
    const students = receivedStudents || [];

    if (error) {
        console.log(error);
        return null;
    }

    return (
        <div
            className={"capitalize overflow-auto h-100 " + styles.student_list_component}
            data-testid="student-list"
        >
            <ListGroup as="ul" className={styles.student_list}>
                <ListGroup.Item
                    key="studentHeader"
                    data-testid="studentlist-header"
                    className={"container " + styles.student_list_title}
                >
                    <div className="row align-items-center">
                        <h2 className="col">{t("students")}</h2>
                        {props.showAdd && isAdmin && (
                            <Button
                                data-testid="new-student-button"
                                className="col-md-auto"
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                    router.push(transformer("/" + applicationPaths.studentCreation))
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1.5em"
                                    height="1.5em"
                                    fill="currentColor"
                                    className="bi bi-plus"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                            </Button>
                        )}
                    </div>
                </ListGroup.Item>
                {students
                    .map((student) => ({
                        student,
                        studentId: student._links.self.href.split(apiPaths.base)[1],
                    }))
                    .map(({ student, studentId }) => (
                        <ListGroup.Item
                            key={studentId}
                            className={styles.student_list_element}
                            action
                            as={"li"}
                            draggable={draggable}
                            onDragStart={(event) => {
                                event.dataTransfer.setData("url", student._links.self.href);
                                event.dataTransfer.setData("name", student.firstName);
                            }}
                            onClick={async () => {
                                if (!draggable) {
                                    const studentId: string = extractIdFromStudentUrl(
                                        student._links.self.href
                                    );
                                    await router.replace({
                                        pathname: "/" + applicationPaths.students + "/" + studentId,
                                        query: { ...router.query },
                                    });
                                }
                            }}
                        >
                            <h6 className={styles.student_name}>{student.callName}</h6>
                            <small className={styles.student_best_skill}>{student.bestSkill}</small>
                            <SuggestionCount studentUrl={student._links.self.href} />
                        </ListGroup.Item>
                    ))}
            </ListGroup>
            <footer className={"py-3 position-sticky bottom-0"} style={{ backgroundColor: "#0a0839" }}>
                <StudentStatusButton status={Status.approved} colour="#1DE1AE" />
                <StudentStatusButton status={Status.maybe} colour="#FCB70F" />
                <StudentStatusButton status={Status.rejected} colour="#F14A3B" />
                <StudentStatusButton status={Status.undecided} colour="gray" />
            </footer>
        </div>
    );
};
