import { useRouter } from "next/router";
import useSWR from "swr";
import { emptyStudent, IStudent } from "../../../api/entities/StudentEntity";
import { getStudentOnUrl } from "../../../api/calls/studentCalls";
import apiPaths from "../../../properties/apiPaths";
import CreateCommunicationForm from "../../../components/communication/createCommunicationForm";
import { capitalize } from "../../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import {Accordion, Button, Col, Container, Row} from "react-bootstrap";
import AccordionItem from "react-bootstrap/AccordionItem";
import CommunicationListItem from "../../../components/communication/communicationListItem";
import NavBar from "../../../components/util/navBar";
import styles from "../../../styles/pageGrids.module.css";
import {StudentFilterComponent} from "../../../components/student/studentFilterComponent";
import {StudentList} from "../../../components/student/studentList";
import StudentCommunicationList from "../../../components/student/studentCommunicationList";

export default function CommunicationInfoPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const query = router.query as { id: string };
    const studentId = query.id;

    const { data: receivedStudent, error: studentError } = useSWR(
        apiPaths.students + "/" + studentId,
        getStudentOnUrl
    );

    if (studentError) {
        console.log(studentError);
        return null;
    }

    const student: IStudent = receivedStudent || emptyStudent;

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
                            <div className={"h-100"}>
                                <div className={"overflow-auto p-3"} style={{ height: "calc(100% - 4rem)" }}>
                                    <div className="row w-100" style={{ paddingBottom: 15 }}>
                                    </div>
                                    <div className="row w-100" style={{paddingLeft: 25}}>
                                        <h1>{capitalize(t("register communication for")) + " " + student.callName}</h1>
                                        <CreateCommunicationForm student={student} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
