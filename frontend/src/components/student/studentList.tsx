import { ButtonGroup, Button, ListGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import styles from "../../styles/students/studentList.module.css";
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
import {
    useEditionApplicationPathTransformer,
    useSwrForEntityList,
    useSwrForEntityListWithEdition,
    useSwrWithEdition,
} from "../../hooks/utilHooks";
import { StudentStatusButton } from "./studentStatusButton";
import { IStudent, Status } from "../../api/entities/StudentEntity";
import applicationPaths from "../../properties/applicationPaths";
import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import { baseSkillType, ISkillType } from "../../api/entities/SkillTypeEntity";
import useSWR from "swr";
import { getAllSkillTypesFromPage } from "../../api/calls/skillTypeCalls";
import { useRouterPush, useRouterReplace } from "../../hooks/routerHooks";
import useQueriedStudents from "../../hooks/useQueriedStudents";

export const StudentList = (props: { isDraggable: boolean; showAdd?: boolean }) => {
    const draggable = props.isDraggable;
    const { t } = useTranslation("common");
    const router = useRouter();
    const routerPush = useRouterPush();
    const routerReplace = useRouterReplace();
    const params: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);

    const isAdmin = useCurrentAdminUser();

    const { data: receivedStudents, error: studentsError } = useQueriedStudents();

    const { data: receivedSkillTypes, error: skillTypesError } = useSwrForEntityList(
        apiPaths.skillTypes,
        getAllSkillTypesFromPage
    );
    const skillTypes: ISkillType[] = receivedSkillTypes || [];
    const skillTypeNames = skillTypes.map((skill) => skill.name);

    const students = params.skills.some((skill) => skill.toUpperCase() === baseSkillType.toUpperCase())
        ? (receivedStudents || []).filter((student: IStudent) => {
              return student.skills.some((skill) => !skillTypeNames.includes(skill));
          })
        : receivedStudents || [];

    if (studentsError || skillTypesError) {
        console.log(studentsError || skillTypesError);
        return null;
    }

    return (
        <div className={"capitalize h-100 " + styles.student_list_component} data-testid="student-list">
            <ListGroup as="ul" className={"overflow-auto " + styles.student_list}>
                <ListGroup.Item
                    key="studentHeader"
                    data-testid="studentlist-header"
                    className={"container " + styles.student_list_title}
                >
                    <h2 className={styles.student_list_title_text}>{t("students")}</h2>
                    {props.showAdd && isAdmin && (
                        <Button
                            data-testid="new-student-button"
                            variant="outline-primary"
                            className={styles.student_list_new_button}
                            size="sm"
                            onClick={() => routerPush("/" + applicationPaths.studentCreation)}
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
                                    await routerReplace({
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
            <footer className={"py-3 " + styles.student_list_footer}>
                <ButtonGroup className={styles.student_list_button_group}>
                    <StudentStatusButton status={Status.approved} colour="#1DE1AE" />
                    <StudentStatusButton status={Status.maybe} colour="#FCB70F" />
                    <StudentStatusButton status={Status.rejected} colour="#F14A3B" />
                    <StudentStatusButton status={Status.undecided} colour="gray" />
                </ButtonGroup>
            </footer>
        </div>
    );
};
