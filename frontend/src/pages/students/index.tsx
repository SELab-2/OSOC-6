import { NextPage } from 'next';
import NavBar from '../../components/util/navBar';
import styles from '../../styles/pageGrids.module.css';
import { StudentList } from '../../components/student/studentList';
import { StudentFilterComponent } from '../../components/student/studentFilterComponent';

const StudentsPage: NextPage = () => {
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
                    <div className={"d-flex justify-content-center align-items-center " + styles.info_field}>
                        <p data-testid="student-select-message">select a student to start</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentsPage;
