import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../properties/apiPaths";
import useSWR from "swr";
import { getAllStudentInfo } from "../api/calls/studentCalls";
import { capitalize } from "../utility/stringUtil";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import styles from "../styles/studentList.module.css";
import { SuggestionStrategy } from "../api/entities/SuggestionEntity";
import { CustomDialogContent } from "./suggestionModal";

export function StudentInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query as { id: string };

    const { data, error } = useSWR(apiPaths.students + "/" + id, getAllStudentInfo);

    if (error || !data) {
        return null;
    }

    let experiences = {
        YES_NO_STUDENT_COACH: "student yes_noStudentCoach",
        YES_STUDENT_COACH: "student yes_StudentCoach",
        NONE: "student none",
    }[data.student.osocExperience];

    return (
        <div>
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <h1>{data.student.callName}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ListGroup className="list-group-horizontal" as="ul">
                            {data.student.skills.map((skill) => (
                                <ListGroupItem key={skill} className={styles.skillStyle}>
                                    <p>{skill}</p>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                </div>
                <br />
                <h2>{capitalize(t("student suggestions"))}</h2>
                <ListGroup as="ul">
                    {data.suggestions
                        .map((suggestion) => ({
                            suggestion,
                            suggestionId: suggestion.suggestion._links.self.href.split(apiPaths.base)[1],
                        }))
                        .map(({ suggestion, suggestionId }) => (
                            <ListGroup.Item key={suggestionId} as={"li"}>
                                <div>
                                    {suggestion.coach.callName}: {suggestion.suggestion.reason}
                                </div>
                            </ListGroup.Item>
                        ))}
                </ListGroup>
                <br />
                <h2>{capitalize(t("student about"))}</h2>
                <a href={data.student.curriculumVitaeURI}>{capitalize(t("student cv"))}</a> <br />
                <a href={data.student.portfolioURI}>{capitalize(t("student portfolio"))}</a> <br />
                <a href={data.student.motivationURI}>{capitalize(t("student motivation"))}</a> <br />
                <br />
                <h2>{capitalize(t("student personal details"))}</h2>
                <div>
                    {capitalize(t("student gender"))}: {data.student.gender.toLowerCase()}{" "}
                    {t("student pronouns")} {data.student.pronouns.toLowerCase()}
                </div>
                <div>
                    {capitalize(t("student native language"))}: {data.student.mostFluentLanguage}
                </div>
                <div>
                    {capitalize(t("student english proficiency"))}:{" "}
                    {data.student.englishProficiency.toLowerCase()}
                </div>
                <div>
                    {capitalize(t("student phone number"))}: {data.student.phoneNumber}
                </div>
                <div>
                    {capitalize(t("student email"))}: {data.student.email}
                </div>
                <br />
                <h2>{capitalize(t("student education"))}</h2>
                <div>
                    {capitalize(t("student studies"))}: {data.student.studies.join(", ")}
                </div>
                <div>
                    {capitalize(t("student institution"))}: {data.student.institutionName}
                </div>
                <div>
                    {capitalize(t("student current diploma"))}: {data.student.currentDiploma}
                </div>
                <div>
                    {capitalize(t("student degree year"))}: {data.student.yearInCourse}{" "}
                    {t("student degree duration")} {data.student.durationCurrentDegree}
                </div>
                <div>
                    {capitalize(t("student applied for"))}: {data.student.skills.join(", ")}
                </div>
                <div>
                    {capitalize(t("student osoc experience"))}: {t(experiences)}
                </div>
            </div>
            <footer className="studentfooter py-3 fixed-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-sm">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm">
                                        <CustomDialogContent
                                            suggestion={SuggestionStrategy.yes}
                                            style={{ color: "#1DE1AE", borderColor: "#1DE1AE", width: 150 }}
                                            studentUrl={data.student._links.self.href}
                                        />
                                    </div>
                                    <div className="col-sm">
                                        <CustomDialogContent
                                            suggestion={SuggestionStrategy.maybe}
                                            style={{ color: "#FCB70F", borderColor: "#FCB70F", width: 150 }}
                                            studentUrl={data.student._links.self.href}
                                        />
                                    </div>
                                    <div className="col-sm">
                                        <CustomDialogContent
                                            suggestion={SuggestionStrategy.no}
                                            style={{ color: "#F14A3B", borderColor: "#F14A3B", width: 150 }}
                                            studentUrl={data.student._links.self.href}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm">Add definite decision</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
