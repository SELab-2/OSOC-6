import { NextPage } from "next";
import { Modal, Col, Row, ModalTitle, ModalBody, ModalHeader, Badge } from "react-bootstrap";
import NavBar from "../components/navBar";
import styles from "../styles/pageGrids.module.css";
import { StudentList } from "../components/studentList";
import ProjectAsignmentList from "../components/project_assignment/projectAssignmentList";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import apiPaths from "../properties/apiPaths";
import { IUser } from "../api/entities/UserEntity";
import axios from "axios";
import { AxiosConf } from "../api/calls/baseCalls";
import { Assignment } from "../api/entities/AssignmentEntity";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../utility/stringUtil";

type SkillInfo = { skillName: string; skillColor: string; skillUrl: string };
export type DropHandler = (
    studentName: string,
    studentUrl: string,
    skillInfo: SkillInfo,
    projectName: string
) => void;

const AssignStudentsPage: NextPage = () => {
    const { t } = useTranslation("common");

    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState<{
        studentName: string;
        studentUrl: string;
        skillInfo: SkillInfo;
        projectName: string;
    }>();

    function handleShow(studentName: string, studentUrl: string, skillInfo: SkillInfo, projectName: string) {
        setModalInfo({ studentName, studentUrl, skillInfo, projectName });
        setShowModal(true);
    }

    async function dropStudent(values: { reason: string }) {
        const user: IUser = (await axios.get(apiPaths.ownUser, AxiosConf)).data;
        if (modalInfo != undefined) {
            const assignment: Assignment = new Assignment(
                false,
                true,
                values.reason,
                user._links.self.href,
                modalInfo.studentUrl,
                modalInfo.skillInfo.skillUrl
            );
            await axios.post(apiPaths.base + apiPaths.assignments, assignment, AxiosConf);
        }
        handleClose();
    }

    const handleClose = () => setShowModal(false);

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
                        <StudentList isDraggable={true} />
                    </Col>
                    <Col sm={9} xxl={10} className={"h-100"}>
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
                    </Col>
                </Row>
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
                <ModalHeader>
                    <ModalTitle>{capitalize(t("assignment modal title"))}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {modalInfo != undefined ? (
                        <p>
                            You are suggesting {modalInfo.studentName} to project{" "}
                            <i>{modalInfo.projectName}</i> for the role{" "}
                            <Badge bg="" style={{ backgroundColor: modalInfo.skillInfo.skillColor }}>
                                {modalInfo.skillInfo.skillName}
                            </Badge>
                            .
                        </p>
                    ) : (
                        <p></p>
                    )}
                    <div>{capitalize(t("assignment reason"))}</div>
                    <Formik initialValues={{ reason: "" }} onSubmit={dropStudent}>
                        <Form>
                            <Field
                                className="form-control mb-2"
                                type="text"
                                data-testid="suggestion-reason"
                                name="reason"
                                required
                            />
                            <button className="btn btn-primary" type="submit" style={{ float: "right" }}>
                                {capitalize(t("confirm assignment"))}
                            </button>
                        </Form>
                    </Formik>
                </ModalBody>
            </Modal>
        </>
    );
};

export default AssignStudentsPage;
