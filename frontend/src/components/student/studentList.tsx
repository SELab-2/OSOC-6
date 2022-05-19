import { ListGroup } from "react-bootstrap";
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
import { useSwrWithEdition } from "../../hooks/utilHooks";
import { StudentStatusButton } from "./studentStatusButton";
import { Status } from "../../api/entities/StudentEntity";
import applicationPaths from "../../properties/applicationPaths";

export const StudentList = (props: { isDraggable: boolean }) => {
    const draggable = props.isDraggable;
    const { t } = useTranslation("common");
    const router = useRouter();
    const params: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);

    let { data, error } = useSwrWithEdition(
        constructStudentQueryUrl(apiPaths.studentByQuery, params),
        getAllStudentsFromPage
    );
    data = data || [];

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
                    className={styles.student_list_title}
                >
                    <h2>{t("common:students")}</h2>
                </ListGroup.Item>
                {data
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
                                    const studentId: string = extractIdFromStudentUrl(student._links.self.href);
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
