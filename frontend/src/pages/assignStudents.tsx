import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import NavBar from "../components/navBar";
import styles from "../styles/pageGrids.module.css";
import { StudentList } from "../components/studentList";
import ProjectAsignmentList from "../components/project_assignment/projectAssignmentList";

const AssignStudentsPage: NextPage = () => {
    return (
        <>
            <NavBar />
            <div className={styles.projects} data-testid="assign-students-grid">
                <Row className="gx-0 h-25 w-100" data-testid="student-filter">
                    {/* Replace this div with the correct component */}
                    <div
                        className={
                            "d-flex justify-content-center align-items-center h-100 " + styles.placeholder
                        }
                    >
                        <p>Student filter placeholder</p>
                    </div>
                </Row>
                <Row xs={1} className={"h-75 w-100 gx-0 gx-sm-4 "}>
                    <Col sm={3} xxl={2} className="h-100">
                        <StudentList />
                    </Col>
                    <Col sm={9} xxl={10} className={"h-100"}>
                        <Row className={"h-100"}>
                            <Col className="h-100 overflow-auto pb-2">
                                <ProjectAsignmentList />
                            </Col>
                            <Col className={"visually-hidden"}>
                                {/* Replace this div with the correct component */}
                                <div
                                    className={"d-flex justify-content-center align-items-center w-100 h-100"}
                                    data-testid="conflicts"
                                >
                                    <p>Conflicts placeholder</p>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default AssignStudentsPage;
