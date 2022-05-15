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
import { useEditionApplicationPathTransformer, useSwrWithEdition } from "../../hooks/utilHooks";
import { StudentStatusButton } from "./studentStatusButton";
import { Status } from "../../api/entities/StudentEntity";
import applicationPaths from "../../properties/applicationPaths";
import { getParamsFromQueryUrl, getQueryUrlFromParams } from "../../api/calls/baseCalls";

export const StudentList = (props: { isDraggable: boolean }) => {
    const draggable = props.isDraggable;
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    const params: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);
    console.log("Params:");
    console.log(params);

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
                            onClick={() => {
                                if (!draggable) {
                                    let studentPath: string = extractIdFromStudentUrl(
                                        student._links.self.href
                                    );
                                    let url = transformer(
                                        "/" + applicationPaths.students + "/" + studentPath
                                    );
                                    const params = getParamsFromQueryUrl(router.asPath);
                                    console.log("Params from url");
                                    console.log(params);
                                    console.log("New url");
                                    console.log(getQueryUrlFromParams(url, params));
                                    router.push({ pathname: url, query: params }).catch(console.log);
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
                <StudentStatusButton
                    status={Status.approved}
                    style={{ color: "#1DE1AE", borderColor: "#1DE1AE", width: 150 }}
                />
                <StudentStatusButton
                    status={Status.maybe}
                    style={{ color: "#FCB70F", borderColor: "#FCB70F", width: 150 }}
                />
                <StudentStatusButton
                    status={Status.rejected}
                    style={{ color: "#F14A3B", borderColor: "#F14A3B", width: 150 }}
                />
                <StudentStatusButton
                    status={Status.undecided}
                    style={{ color: "gray", borderColor: "gray", width: 150 }}
                />
            </footer>
        </div>
    );
};
