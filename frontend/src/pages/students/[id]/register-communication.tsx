import { useRouter } from "next/router";
import useSWR from "swr";
import { emptyStudent, IStudent } from "../../../api/entities/StudentEntity";
import { getStudentOnUrl } from "../../../api/calls/studentCalls";
import apiPaths from "../../../properties/apiPaths";
import CreateCommunicationForm from "../../../components/communication/createCommunicationForm";
import { capitalize } from "../../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import { Button, ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import NavBar from "../../../components/util/navBar";
import styles from "../../../styles/pageGrids.module.css";
import { StudentFilterComponent } from "../../../components/student/studentFilterComponent";
import { StudentList } from "../../../components/student/studentList";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import { getAllCommunicationTemplatesFromPage } from "../../../api/calls/communicationTemplateCalls";
import { useState } from "react";
import { ICommunicationTemplate } from "../../../api/entities/CommunicationTemplateEntity";
import CreateCommunicationTemplateForm from "../../../components/communication/createCommunicationTemplateForm";

/**
 * Page that allows you to register a new communication with the given student.
 */
export default function CommunicationInfoPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const query = router.query as { id: string };
    const studentId = query.id;
    const { data: receivedTemplates, error: templateError } = useSWR(
        apiPaths.communicationTemplates,
        getAllCommunicationTemplatesFromPage
    );
    const [selectedTemplate, setSelectedTemplate] = useState<ICommunicationTemplate | undefined>(undefined);
    const [create, setCreate] = useState(false);
    const templates: ICommunicationTemplate[] = receivedTemplates || [];

    const { data: receivedStudent, error: studentError } = useSWR(
        apiPaths.students + "/" + studentId,
        getStudentOnUrl
    );

    if (studentError || templateError) {
        console.log(studentError || templateError);
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
                                    <div className="row w-100" style={{ paddingLeft: 25 }}>
                                        <h1>
                                            {capitalize(t("register communication for")) +
                                                " " +
                                                student.callName}
                                        </h1>
                                        <Row style={{ paddingBottom: 20 }} data-testid="choose-template">
                                            <Col>
                                                <div>{capitalize(t("choose your template"))}:</div>
                                            </Col>
                                            <Col style={{ alignItems: "center", display: "flex" }}>
                                                <Dropdown as={ButtonGroup} drop="down">
                                                    <Dropdown.Toggle
                                                        style={{
                                                            backgroundColor: "#1b1a31",
                                                            borderColor: "white",
                                                            height: 30,
                                                            alignItems: "center",
                                                            display: "flex",
                                                        }}
                                                        data-testid="template-select-main"
                                                    >
                                                        {selectedTemplate
                                                            ? selectedTemplate.name
                                                            : capitalize(t("choose template"))}
                                                    </Dropdown.Toggle>
                                                    <DropdownMenu>
                                                        {templates.map((template) => (
                                                            <DropdownItem
                                                                key={template._links.self.href}
                                                                data-testid={
                                                                    "template-select-" +
                                                                    template._links.self.href
                                                                }
                                                                onClick={() => {
                                                                    setSelectedTemplate(template);
                                                                    setCreate(false);
                                                                }}
                                                            >
                                                                {template.name}
                                                            </DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                        <Row style={{ paddingBottom: 20 }}>
                                            <Col>
                                                <div>{capitalize(t("create template"))}:</div>
                                            </Col>
                                            <Col style={{ alignItems: "center", display: "flex" }}>
                                                <Button
                                                    style={{
                                                        backgroundColor: "#1b1a31",
                                                        borderColor: "white",
                                                        height: 30,
                                                        alignItems: "center",
                                                        display: "flex",
                                                    }}
                                                    onClick={() => setCreate(true)}
                                                >
                                                    Create new template
                                                </Button>
                                            </Col>
                                        </Row>
                                        {create && (
                                            <CreateCommunicationTemplateForm
                                                setTemplate={setSelectedTemplate}
                                                setCreate={setCreate}
                                            />
                                        )}
                                        {selectedTemplate && (
                                            <CreateCommunicationForm
                                                student={student}
                                                template={selectedTemplate}
                                            />
                                        )}
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
