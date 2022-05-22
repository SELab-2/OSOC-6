import NavBar from "../../../components/util/navBar";
import styles from "../../../styles/pageGrids.module.css";
import { StudentFilterComponent } from "../../../components/student/studentFilterComponent";
import { StudentList } from "../../../components/student/studentList";
import { RegisterCommunication } from "../../../components/communication/registerCommunication";

/**
 * Page that allows you to register a new communication with the given student.
 */
export default function CommunicationInfoPage() {
    return (
        <div>
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
                                    <div className="row w-100" style={{ paddingLeft: 25 }}>
                                        <RegisterCommunication />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
