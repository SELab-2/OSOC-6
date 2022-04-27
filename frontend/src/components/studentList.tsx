import { ListGroup } from "react-bootstrap";
import Router, { useRouter } from "next/router";
import styles from "../styles/studentList.module.css";
import useTranslation from "next-translate/useTranslation";
import apiPaths from "../properties/apiPaths";
import {
    baseUrlAndQueryParamsToUrl,
    getAllStudentsFormPage,
    IStudentQueryParams,
} from "../api/calls/studentCalls";
import useSWR from "swr";
import { SuggestionCount } from "./suggestionCount";
import { getStudentQueryParamsFromQuery } from "./studentFilterComponent";

export const StudentList = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const params: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);

    let { data, error } = useSWR(
        baseUrlAndQueryParamsToUrl(apiPaths.studentByQuery, {
            ...params,
            editionId: 3,
        }),
        getAllStudentsFormPage
    );
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
