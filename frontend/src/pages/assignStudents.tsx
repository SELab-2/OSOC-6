import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import NavBar from "../components/util/navBar";
import styles from "../styles/pageGrids.module.css";
import { StudentList } from "../components/student/studentList";
import ProjectAsignmentList from "../components/projectAssignment/projectAssignmentList";
import { useState } from "react";
import AssignmentModal, { ModalSkillInfo } from "../components/projectAssignment/assignmentModal";
import { StudentFilterComponent } from "../components/student/studentFilterComponent";
import ConflictResolutionList from "../components/conflictResolution/conflictResolutionList";
import { useSwrWithEdition } from "../hooks/utilHooks";
import apiPaths from "../properties/apiPaths";
import { getAllStudentsFromPage } from "../api/calls/studentCalls";
import { capitalize } from "../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import useConflictStudents from "../hooks/useConflictStudents";

export type DropHandler = (
    studentName: string,
    studentUrl: string,
    skillInfo: ModalSkillInfo,
    projectName: string
) => void;

const AssignStudentsPage: NextPage = () => {
    const { t } = useTranslation("common");

    const [showModal, setShowModal] = useState(false);
    const [showConflicts, setShowConflicts] = useState(false);
    const [modalInfo, setModalInfo] = useState<{
        studentName: string;
        studentUrl: string;
        skillInfo: ModalSkillInfo;
        projectName: string;
    }>();

    const { data: receivedStudents, error: studentsError } = useConflictStudents();

    if (showConflicts && receivedStudents?.length === 0) {
        setShowConflicts(false);
    }

    function handleShow(
        studentName: string,
        studentUrl: string,
        skillInfo: ModalSkillInfo,
        projectName: string
    ) {
        setModalInfo({ studentName, studentUrl, skillInfo, projectName });
        setShowModal(true);
    }

    function changeShowConflicts() {
        setShowConflicts(!showConflicts);
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
                                {receivedStudents !== undefined && receivedStudents.length > 0 && (
                                    <button
                                        className={styles.conflicts_button + " btn btn-outline-primary"}
                                        onClick={changeShowConflicts}
                                    >
                                        {capitalize(t("some students are assigned to multiple projects"))}
                                    </button>
                                )}
                                <ProjectAsignmentList dropHandler={handleShow} />
                            </Col>
                            {showConflicts && (
                                <Col>
                                    <ConflictResolutionList />
                                </Col>
                            )}
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
