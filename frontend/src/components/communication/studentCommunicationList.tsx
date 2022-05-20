import { IStudent } from "../../api/entities/StudentEntity";
import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getParamsFromQueryUrl, getQueryUrlFromParams } from "../../api/calls/baseCalls";
import { extractIdFromStudentUrl } from "../../api/calls/studentCalls";
import { ICommunication } from "../../api/entities/CommunicationEntity";
import { getAllCommunicationFromPage } from "../../api/calls/communicationCalls";
import CommunicationListItem from "./communicationListItem";
import { Button } from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import { useRouter } from "next/router";
import { Accordion, Container } from "react-bootstrap";
import AccordionItem from "react-bootstrap/AccordionItem";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import { getStudentQueryParamsFromQuery } from "../student/studentFilterComponent";

export interface CommunicationListProps {
    student: IStudent | undefined;
}

export default function StudentCommunicationList({ student }: CommunicationListProps) {
    const router = useRouter();
    const studentId = extractIdFromStudentUrl(student!._links.self.href);
    const { data: receivedCommunications, error: communicationsError } = useSWR(
        student
            ? getQueryUrlFromParams(apiPaths.communicationsByStudent, {
                  studentId: studentId,
                  sort: "timestamp",
              })
            : null,
        getAllCommunicationFromPage
    );

    if (communicationsError) {
        console.log(communicationsError);
        return null;
    }

    const communications: ICommunication[] = receivedCommunications || [];

    async function openStudentInfo() {
        const params = getParamsFromQueryUrl(router.asPath);
        const studentCommUrl = "/" + applicationPaths.students + "/" + studentId;
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
                        style={{ color: "white", borderColor: "white" }}
                        onClick={openStudentInfo}
                    >
                        Student info
                    </Button>
                </div>
                <div className="row w-100">
                    <div>
                        <h1>{student?.callName}</h1>
                    </div>
                    <div data-testid="communication-list">
                        <Container className="overflow-auto h-100 pt-2">
                            <Accordion>
                                {communications.map((communication, index) => {
                                    return (
                                        <AccordionItem
                                            key={index}
                                            eventKey={`${index}`}
                                            data-testid="communication"
                                        >
                                            <CommunicationListItem
                                                communication={communication}
                                                key={communication._links.self.href}
                                                index={index}
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
