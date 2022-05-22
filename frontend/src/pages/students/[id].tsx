import { NextPage } from "next";
import NavBar from "../../components/util/navBar";
import styles from "../../styles/pageGrids.module.css";
import { StudentList } from "../../components/student/studentList";
import { StudentInfo } from "../../components/student/studentInfo";
import { StudentFilterComponent } from "../../components/student/studentFilterComponent";

const StudentsIDPage: NextPage = () => {
    return (
        <>
            <NavBar />
            <div className={styles.filter_grid} data-testid="students-grid">
                <div className={styles.filter}>
                    <StudentFilterComponent />
                </div>
                <div className={styles.info_grid + " " + styles.height_setter}>
                    <div className={styles.sidebar}>
                        <StudentList isDraggable={false} showAdd={true} />
                    </div>
                    <div className={styles.info_field}>
                        <div
                            className={"d-flex justify-content-center align-items-center h-100"}
                            data-testid="student-info"
                        >
                            <StudentInfo />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentsIDPage;
