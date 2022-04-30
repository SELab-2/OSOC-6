import { ListGroup } from "react-bootstrap";
import styles from "../styles/studentList.module.css";
import useTranslation from "next-translate/useTranslation";
import apiPaths from "../properties/apiPaths";
import { getAllStudentsFormLinks } from "../api/calls/studentCalls";
import useSWR from "swr";
import Router from "next/router";
import { SuggestionCount } from "./suggestionCount";

export const StudentList = (props: any) => {
    const draggable = props.isDraggable;
    const { t } = useTranslation("common");
    let { data, error } = useSWR(apiPaths.students, getAllStudentsFormLinks);
    data = data || [];

    if (error) {
        console.log(error);
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
                            // Should be changed to individual student page later
                            onClick={() => {
                                let studentPath: string = student._links.self.href.split(apiPaths.base)[1];
                                Router.push(studentPath);
                            }}
                        >
                            <h6 className={styles.student_name}>{student.callName}</h6>
                            <small className={styles.student_best_skill}>{student.bestSkill}</small>
                            <SuggestionCount studentUrl={student._links.self.href} />
                        </ListGroup.Item>
                    ))}
            </ListGroup>
        </div>
    );
};
