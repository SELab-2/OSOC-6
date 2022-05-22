import { capitalize } from "../../utility/stringUtil";
import { Button, ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import CreateCommunicationTemplateForm from "./createCommunicationTemplateForm";
import { extractIdFromStudentUrl, getStudentOnUrl } from "../../api/calls/studentCalls";
import CreateCommunicationForm from "./createCommunicationForm";
import { emptyStudent, IStudent } from "../../api/entities/StudentEntity";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getAllCommunicationTemplatesFromPage } from "../../api/calls/communicationTemplateCalls";
import { useState } from "react";
import { ICommunicationTemplate } from "../../api/entities/CommunicationTemplateEntity";
import { useSwrForEntityList } from "../../hooks/utilHooks";

export function RegisterCommunication() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const query = router.query as { id: string };
    const studentId = query.id;
    const { data: receivedTemplates, error: templateError } = useSwrForEntityList(
        apiPaths.communicationTemplates,
        getAllCommunicationTemplatesFromPage
    );
    const [selectedTemplate, setSelectedTemplate] = useState<ICommunicationTemplate | undefined>(undefined);
    const [create, setCreate] = useState(false);
    const [edit, setEdit] = useState(false);
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
        <div data-testid="register-communication">
            <h4>{capitalize(t("register communication for")) + " " + student.callName}</h4>
            <hr />
            <Row
                style={{ paddingBottom: 20, margin: "1rem", marginTop: "2rem" }}
                data-testid="choose-template"
            >
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
                            data-testid="template-select"
                        >
                            {selectedTemplate ? selectedTemplate.name : capitalize(t("choose template"))}
                        </Dropdown.Toggle>
                        <DropdownMenu data-testid="template-select-menu">
                            {templates.map((template) => (
                                <DropdownItem
                                    key={template._links.self.href}
                                    eventKey={template._links.self.href}
                                    data-testid={template._links.self.href}
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
                    <Button
                        style={{
                            marginLeft: "1rem",
                            backgroundColor: "#1b1a31",
                            borderColor: "white",
                            height: 30,
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                            width: 175,
                        }}
                        data-testid="edit-template"
                        onClick={() => setEdit(true)}
                    >
                        {capitalize(t("edit template"))}
                    </Button>
                </Col>
            </Row>
            <Row style={{ paddingBottom: 20, margin: "1rem" }}>
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
                        data-testid="new-template"
                        onClick={() => {
                            setCreate(true);
                            setSelectedTemplate(undefined);
                        }}
                    >
                        {capitalize(t("create new template"))}
                    </Button>
                </Col>
            </Row>
            {(create || edit) && (
                <CreateCommunicationTemplateForm
                    template={selectedTemplate}
                    studentId={extractIdFromStudentUrl(student._links.self.href)}
                    setTemplate={setSelectedTemplate}
                    setCreate={setCreate}
                    setEdit={setEdit}
                />
            )}
            {selectedTemplate && !(edit || create) && (
                <CreateCommunicationForm student={student} template={selectedTemplate} />
            )}
        </div>
    );
}
