import StudentCommunicationList from "../../../components/student/studentCommunicationList";
import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getStudentOnUrl } from "../../../api/calls/studentCalls";
import { NextPage } from "next";
import NavBar from "../../../components/util/navBar";
import styles from "../../../styles/pageGrids.module.css";
import { StudentFilterComponent } from "../../../components/student/studentFilterComponent";
import { StudentList } from "../../../components/student/studentList";

/**
 * Page listing the communication with a student.
 */
export default function CommunicationPage() {
    const router = useRouter();
    const query = router.query as { id: string };

    const { data: receivedStudent, error: studentError } = useSWR(
        apiPaths.students + "/" + query.id,
        getStudentOnUrl
    );

    if (studentError) {
        console.log(studentError);
        return null;
    }

    return (
        <>
            <NavBar />
            <div className={styles.filter_grid} data-testid="students-grid">
                <div className={styles.filter}>
                    <StudentFilterComponent />
                </div>
                <div className={styles.info_grid + " " + styles.height_setter}>
                    <div className={styles.sidebar}>
                        <StudentList isDraggable={false} />
                    </div>
                    <div className={styles.info_field}>
                        <div
                            className={"d-flex justify-content-center align-items-center h-100 w-100"}
                            data-testid="student-communication"
                        >
                            <StudentCommunicationList studentUrl={receivedStudent?._links.self.href} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
