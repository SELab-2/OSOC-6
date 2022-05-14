import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import NavBar from "../../components/util/navBar";
import styles from "../../styles/pageGrids.module.css";
import { StudentList } from "../../components/student/studentList";
import { StudentFilterComponent } from "../../components/student/studentFilterComponent";

const StudentsPage: NextPage = () => {
    return (
        <>
            <NavBar />
            <div className={styles.projects} data-testid="students-grid">
                <Row className="gx-0 h-25 w-100">
                    <StudentFilterComponent />
                </Row>
                <Row xs={1} className={"h-75 w-100 gx-0 gx-sm-4"}>
                    <Col sm={3} xxl={2} className="h-100">
                        <StudentList isDraggable={false} />
                    </Col>
                    <Col sm={9} xxl={10} className="d-flex justify-content-center align-items-center">
                        <p data-testid="student-select-message">select a student to start</p>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default StudentsPage;
