import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getParamsFromQueryUrl, getQueryUrlFromParams } from "../../api/calls/baseCalls";
import { extractIdFromStudentUrl } from "../../api/calls/studentCalls";
import { ICommunication } from "../../api/entities/CommunicationEntity";
import { getAllCommunicationFromPage } from "../../api/calls/communicationCalls";
import CommunicationListItem from "../communication/communicationListItem";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import { useRouter } from "next/router";
import AccordionItem from "react-bootstrap/AccordionItem";
import { capitalize } from "../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import { IStudent } from "../../api/entities/StudentEntity";
import { useSwrForEntityList } from "../../hooks/utilHooks";

/**
 * Properties needed for [StudentCommunicationList].
 */
export interface CommunicationListProps {
    student: IStudent;
}

/**
 * Component listing all communication with a given student.
 * @param studentUrl the url of the communication that needs to be listed.
 */
export default function StudentCommunicationList({ student }: CommunicationListProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const id = extractIdFromStudentUrl(student._links.self.href);
    const { data: receivedCommunications, error: communicationsError } = useSwrForEntityList(
        student
            ? getQueryUrlFromParams(apiPaths.communicationsByStudent, {
                  studentId: id,
                  sort: "timestamp",
              })
            : null,
        getAllCommunicationFromPage
    );

    if (communicationsError) {
        console.log(communicationsError);
        return null;
    }

    const communications: ICommunication[] = receivedCommunications?.reverse() || [];

    async function openStudentInfo() {
        const params = getParamsFromQueryUrl(router.asPath);
        const studentCommUrl = "/" + applicationPaths.students + "/" + id;
        await router.replace({
            pathname: studentCommUrl,
            query: { ...router.query, ...params },
        });
    }

    async function registerNewCommunication() {
        const params = getParamsFromQueryUrl(router.asPath);
        const studentCommUrl =
            "/" + applicationPaths.students + "/" + id + "/" + applicationPaths.communicationRegistration;
        await router.replace({
            pathname: studentCommUrl,
            query: { ...router.query, ...params },
        });
    }

    return (
        <div className={"h-100"}>
            <div className={"overflow-auto p-3"} style={{ height: "calc(100% - 4rem)" }}>
                <div className="row w-100" style={{ paddingBottom: 15 }}>
                    <Button
                        variant="btn-outline"
                        data-testid="open-studentinfo"
                        style={{ color: "white", borderColor: "white" }}
                        onClick={openStudentInfo}
                    >
                        {capitalize(t("student info"))}
                    </Button>
                </div>
                <div className="row w-100">
                    <Row style={{ display: "flex", justifyContent: "space-between" }}>
                        <Col>
                            <h1>{student?.callName}</h1>
                        </Col>
                        <Col>
                            <Button
                                style={{ color: "white", borderColor: "white", backgroundColor: "#1b1a32" }}
                                onClick={registerNewCommunication}
                            >
                                {capitalize(t("add communication"))}
                            </Button>
                        </Col>
                    </Row>
                    <div data-testid="communication-list">
                        <Container className="overflow-auto h-100 pt-2">
                            <Accordion>
                                {communications.map((communication) => {
                                    return (
                                        <AccordionItem
                                            key={communication._links.self.href}
                                            eventKey={communication._links.self.href}
                                            data-testid="communication"
                                        >
                                            <CommunicationListItem
                                                communication={communication}
                                                key={communication._links.self.href}
                                            />
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
}
