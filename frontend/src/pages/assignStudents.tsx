import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import NavBar from "../components/util/navBar";
import styles from "../styles/pageGrids.module.css";
import { StudentList } from "../components/student/studentList";
import ProjectAsignmentList from "../components/projectAssignment/projectAssignmentList";
import { useState } from "react";
import AssignmentModal, { ModalSkillInfo } from "../components/projectAssignment/assignmentModal";
import { StudentFilterComponent } from "../components/student/studentFilterComponent";

export type DropHandler = (
    studentName: string,
    studentUrl: string,
    skillInfo: ModalSkillInfo,
    projectName: string
) => void;

const AssignStudentsPage: NextPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState<{
        studentName: string;
        studentUrl: string;
        skillInfo: ModalSkillInfo;
        projectName: string;
    }>();

    function handleShow(
        studentName: string,
        studentUrl: string,
        skillInfo: ModalSkillInfo,
        projectName: string
    ) {
        setModalInfo({ studentName, studentUrl, skillInfo, projectName });
        setShowModal(true);
    }

    return (
        <>
            <NavBar />
            <div className={styles.filter_grid} data-testid="assign-students-grid">
                <div className={styles.filter}>
                    <StudentFilterComponent />
                </div>
                <div className={styles.info_grid + " " + styles.height_setter}>
                    <div className={styles.sidebar}>
                        <StudentList isDraggable={true} />
                    </div>
                    <div className={styles.info_field}>
                        <Row className={"h-100"}>
                            <Col className="h-100 overflow-auto pb-2">
                                <ProjectAsignmentList dropHandler={handleShow} />
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
                    </div>
                </div>
            </div>
            {modalInfo !== undefined ? (
                <AssignmentModal
                    studentName={modalInfo.studentName}
                    studentUrl={modalInfo.studentUrl}
                    projectName={modalInfo.projectName}
                    skillName={modalInfo.skillInfo.skillName}
                    skillUrl={modalInfo.skillInfo.skillUrl}
                    showModal={showModal}
                    setter={setShowModal}
                />
            ) : (
                <></>
            )}
        </>
    );
};

export default AssignStudentsPage;
