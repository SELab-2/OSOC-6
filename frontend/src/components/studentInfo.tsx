import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../properties/apiPaths";
import useSWR from "swr";
import { getAllStudentInfo } from "../api/calls/studentCalls";
import { capitalize } from "../utility/stringUtil";
import { Badge, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { SuggestionStrategy } from "../api/entities/SuggestionEntity";
import { SuggestionModal } from "./suggestionModal";
import { StudentStatus } from "./studentStatus";
import { useSwrWithEdition } from "../hooks/utilHooks";
import Image from "next/image";

export function StudentInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query as { id: string };

    const { data, error } = useSwrWithEdition(apiPaths.students + "/" + id, getAllStudentInfo);

    if (error || !data) {
        return null;
    }

    let motivation;
    if (data.student.motivationURI == "") {
        motivation = (
            <>
                <div>{data.student.writtenMotivation}</div>
            </>
        );
    } else {
        motivation = (
            <>
                <a href={data.student.motivationURI}>{capitalize(t("motivation"))}</a>
                <br />
            </>
        );
    }

    const strategyIndication = {
        YES: "/resources/check_green.svg",
        NO: "/resources/x.svg",
        MAYBE: "/resources/question.svg",
    };

    return (
        <div>
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <h1>{data.student.callName}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ListGroup className="list-group-horizontal" as="ul">
                            {data.skills.map((skill) => {
                                return (
                                    <ListGroupItem key={skill.name} style={{ background: skill.colour }}>
                                        <Badge bg="">{skill.name}</Badge>
                                    </ListGroupItem>
                                );
                            })}
                        </ListGroup>
                    </div>
                </div>
                <br />
                <h2>{capitalize(t("suggestions"))}</h2>
                <ListGroup as="ul">
                    {data.suggestions
                        .map((suggestion) => ({
                            suggestion,
                            suggestionId: suggestion.suggestion._links.self.href,
                        }))
                        .map(({ suggestion, suggestionId }) => (
                            <ListGroup.Item key={suggestionId} as={"li"}>
                                <Row>
                                    <Col sm={1}>
                                        <Image
                                            alt={capitalize(t("edit"))}
                                            src={strategyIndication[suggestion.suggestion.strategy]}
                                            width="20"
                                            height="20"
                                        />
                                    </Col>
                                    <Col>
                                        <div>
                                            {suggestion.coach.callName}: {suggestion.suggestion.reason}
                                        </div>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                </ListGroup>
                <br />
                <h2>{capitalize(t("student about"))}</h2>
                <a href={data.student.curriculumVitaeURI}>{capitalize(t("cv"))}</a> <br />
                <a href={data.student.portfolioURI}>{capitalize(t("portfolio"))}</a> <br />
                {motivation}
                <br />
                <h2>{capitalize(t("personal details"))}</h2>
                <div>
                    {capitalize(t("gender"))}: {data.student.gender.toLowerCase()} {t("pronouns")}{" "}
                    {data.student.pronouns.toLowerCase()}
                </div>
                <div>
                    {capitalize(t("native language"))}: {data.student.mostFluentLanguage}
                </div>
                <div>
                    {capitalize(t("english proficiency"))}: {data.student.englishProficiency.toLowerCase()}
                </div>
                <div>
                    {capitalize(t("phone number"))}: {data.student.phoneNumber}
                </div>
                <div>
                    {capitalize(t("email"))}: {data.student.email}
                </div>
                <br />
                <h2>{capitalize(t("education"))}</h2>
                <div>
                    {capitalize(t("studies"))}: {data.student.studies.join(", ")}
                </div>
                <div>
                    {capitalize(t("institution"))}: {data.student.institutionName}
                </div>
                <div>
                    {capitalize(t("current diploma"))}: {data.student.currentDiploma}
                </div>
                <div>
                    {capitalize(t("degree year"))}: {data.student.yearInCourse} {t("degree duration")}{" "}
                    {data.student.durationCurrentDegree}
                </div>
                <div>
                    {capitalize(t("applied for"))}: {data.student.skills.join(", ")}
                </div>
                <div>
                    {capitalize(t("osoc experience"))}: {t(data.student.osocExperience)}
                </div>
            </div>
            <footer className={"py-3 position-sticky bottom-0"} style={{ backgroundColor: "white" }}>
                <Row>
                    <Col sm={8}>
                        <Row>
                            <div className="col-sm">
                                <SuggestionModal
                                    suggestion={SuggestionStrategy.yes}
                                    style={{ color: "#1DE1AE", borderColor: "#1DE1AE", width: 150 }}
                                    studentUrl={data.student._links.self.href}
                                />
                            </div>
                            <div className="col-sm">
                                <SuggestionModal
                                    suggestion={SuggestionStrategy.maybe}
                                    style={{ color: "#FCB70F", borderColor: "#FCB70F", width: 150 }}
                                    studentUrl={data.student._links.self.href}
                                />
                            </div>
                            <div className="col-sm">
                                <SuggestionModal
                                    suggestion={SuggestionStrategy.no}
                                    style={{ color: "#F14A3B", borderColor: "#F14A3B", width: 150 }}
                                    studentUrl={data.student._links.self.href}
                                />
                            </div>
                        </Row>
                    </Col>
                    <Col sm={4}>
                        <StudentStatus
                            studentUrl={data.student._links.self.href}
                            status={data.student.status}
                        />
                    </Col>
                </Row>
            </footer>
        </div>
    );
}
