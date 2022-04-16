import { ListGroup } from "react-bootstrap";
import Router from "next/router";
import styles from "../styles/studentList.module.css";
import { NewProjectButton } from "./newProjectButton";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import apiPaths from "../properties/apiPaths";
import { getAllStudentsFromLinks } from "../api/calls/studentCalls";
import {IStudent} from "../api/entities/StudentEntity";

export const StudentList = () => {
    const { t } = useTranslation("common");
    const [students, setStudents] = useState<any[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            setStudents(await getAllStudentsFromLinks(apiPaths.students));
        }
        fetchStudents().catch(console.log);
    }, []);

    if (!students) {
        return null;
    }

    const color1 = "#343336";
    const color2 = "#B408A4";

    return (
        <div className={styles.student_list_component}>
            <ListGroup as="ul" className="overflow-scroll">
                <ListGroup.Item
                    data-testid="studentlist-header"
                    className={styles.student_list_title}
                >
                    {t("common:Student list header")}
                </ListGroup.Item>
                {students.map((student: IStudent) => (
                    <ListGroup.Item
                        key={student._links.self.href.split(apiPaths.projects)[1]}
                        className={styles.student_list_element}
                        action
                        as={"li"}
                        // Should be changed to individual student page later
                        onClick={() => {
                            let projectPath: string = student._links.self.href.split(
                                apiPaths.base
                            )[1];
                            Router.push(projectPath);
                        }}
                    >
                        <small className={styles.student_name}>{student.callName}</small>
                        <br/>
                        <small className={styles.student_best_skill}>{student.bestSkill}</small>
                        <div className={styles.line}
                             style={{background: `linear-gradient(to right, #1DE1AE 33%, #FCB70F 33% 66%, #F14A3B 66% 100%)`}}/>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};