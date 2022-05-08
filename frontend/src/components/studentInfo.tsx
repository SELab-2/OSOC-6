import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../properties/apiPaths";
import { capitalize } from "../utility/stringUtil";
import { Col, ListGroup, Row } from "react-bootstrap";
import { SuggestionStrategy } from "../api/entities/SuggestionEntity";
import { SuggestionModal } from "./suggestionModal";
import { StudentStatus } from "./studentStatus";
import Image from "next/image";
import useFullStudentInfo from "../hooks/useFullStudentInfo";
import { emptyStudent, IStudent } from "../api/entities/StudentEntity";
import { IFullSuggestion } from "../api/calls/suggestionCalls";
import SkillBadge from "./skillBadge";

export function StudentInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query as { id: string };

    const { data, error } = useFullStudentInfo(apiPaths.students + "/" + id);

    if (error || !data) {
        return null;
    }

    const student: IStudent = data.student || emptyStudent;
    const suggestions: IFullSuggestion[] = data.suggestions || [];

    let motivation;
    if (student.motivationURI == "") {
        motivation = (
            <>
                <div>{student.writtenMotivation}</div>
            </>
        );
    } else {
        motivation = (
            <>
                <a href={student.motivationURI}>{capitalize(t("motivation"))}</a>
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
                        <h1>{student.callName}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ListGroup className="list-group-horizontal" as="ul">
                            {student.skills.map((skill) => (
                                <SkillBadge skill={skill} key={skill} />
                            ))}
                        </ListGroup>
                    </div>
                </div>
                <br />
                <h2>{capitalize(t("suggestions"))}</h2>
                <ListGroup as="ul">
                    {suggestions
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
                <a href={student.curriculumVitaeURI}>{capitalize(t("cv"))}</a> <br />
                <a href={student.portfolioURI}>{capitalize(t("portfolio"))}</a> <br />
                {motivation}
                <br />
                <h2>{capitalize(t("personal details"))}</h2>
                <div>
                    {capitalize(t("gender"))}: {student.gender.toLowerCase()} {t("pronouns")}{" "}
                    {student.pronouns.toLowerCase()}
                </div>
                <div>
                    {capitalize(t("native language"))}: {student.mostFluentLanguage}
                </div>
                <div>
                    {capitalize(t("english proficiency"))}: {student.englishProficiency.toLowerCase()}
                </div>
                <div>
                    {capitalize(t("phone number"))}: {student.phoneNumber}
                </div>
                <div>
                    {capitalize(t("email"))}: {student.email}
                </div>
                <br />
                <h2>{capitalize(t("education"))}</h2>
                <div>
                    {capitalize(t("studies"))}: {student.studies.join(", ")}
                </div>
                <div>
                    {capitalize(t("institution"))}: {student.institutionName}
                </div>
                <div>
                    {capitalize(t("current diploma"))}: {student.currentDiploma}
                </div>
                <div>
                    {capitalize(t("degree year"))}: {student.yearInCourse} {t("degree duration")}{" "}
                    {student.durationCurrentDegree}
                </div>
                <div>
                    {capitalize(t("applied for"))}: {student.skills.join(", ")}
                </div>
                <div>
                    {capitalize(t("osoc experience"))}: {t(student.osocExperience)}
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
                                    studentUrl={student._links.self.href}
                                />
                            </div>
                            <div className="col-sm">
                                <SuggestionModal
                                    suggestion={SuggestionStrategy.maybe}
                                    style={{ color: "#FCB70F", borderColor: "#FCB70F", width: 150 }}
                                    studentUrl={student._links.self.href}
                                />
                            </div>
                            <div className="col-sm">
                                <SuggestionModal
                                    suggestion={SuggestionStrategy.no}
                                    style={{ color: "#F14A3B", borderColor: "#F14A3B", width: 150 }}
                                    studentUrl={student._links.self.href}
                                />
                            </div>
                        </Row>
                    </Col>
                    <Col sm={4}>
                        <StudentStatus studentUrl={student._links.self.href} status={student.status} />
                    </Col>
                </Row>
            </footer>
        </div>
    );
}