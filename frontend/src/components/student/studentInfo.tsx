import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../../properties/apiPaths";
import { capitalize } from "../../utility/stringUtil";
import { ButtonGroup, Image, ListGroup, Row, Toast, ToastContainer } from "react-bootstrap";
import { SuggestionStrategy } from "../../api/entities/SuggestionEntity";
import { SuggestionModal } from "../suggestion/suggestionModal";
import { StudentStatus } from "./studentStatus";
import { emptyStudent } from "../../api/entities/StudentEntity";
import SkillBadge from "../util/skillBadge";
import useSWR from "swr";
import { deleteStudent, getStudentOnUrl } from "../../api/calls/studentCalls";
import { getAllSuggestionsFromLinks } from "../../api/calls/suggestionCalls";
import SuggestionListItem from "../suggestion/suggestionListItem";
import { StatusCodes } from "http-status-codes";
import timers from "../../properties/timers";
import { useState } from "react";
import { getParamsFromQueryUrl, getQueryUrlFromParams } from "../../api/calls/baseCalls";
import applicationPaths from "../../properties/applicationPaths";
import styles from "../../styles/studentList.module.css";

/**
 * Give an overview of all the studentinfo
 */
export function StudentInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [show, setShow] = useState<boolean>(false);

    let { data: student, error: studentError } = useSWR(apiPaths.students + "/" + id, getStudentOnUrl);
    let { data: suggestions, error: suggestionsError } = useSWR(
        student ? student._links.suggestions.href : null,
        getAllSuggestionsFromLinks
    );

    if (studentError || suggestionsError) {
        console.log(studentError || suggestionsError);
        return null;
    }

    student = student || emptyStudent;
    suggestions = suggestions || [];

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

    async function deleteStudentOnClick() {
        const response = await deleteStudent(student!._links.self.href);
        if (response.status == StatusCodes.NO_CONTENT) {
            try {
                const params = getParamsFromQueryUrl(router.asPath);
                await router.push(getQueryUrlFromParams("/" + applicationPaths.students, params));
            } catch (error) {
                setShow(true);
            }
        } else {
            setShow(true);
        }
    }

    return (
        <div className={"h-100 w-100"}>
            <div className={"overflow-auto p-3"} style={{ height: "calc(100% - 4rem)" }}>
                <div className={styles.student_info_header}>
                    <div className={styles.student_info_header_title}>
                        <h1>{student.callName}</h1>
                    </div>
                    <div className={styles.student_info_header_extra}>
                        <ListGroup className="list-group-horizontal" as="ul">
                            {student.skills.map((skill) => (
                                <SkillBadge skill={skill} key={skill} />
                            ))}
                        </ListGroup>
                        <a onClick={deleteStudentOnClick} data-testid="delete-student">
                            <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
                        </a>
                    </div>
                </div>
                <br />
                <h2>{capitalize(t("suggestions"))}</h2>
                <ListGroup as="ul">
                    {suggestions.map((suggestion) => (
                        <SuggestionListItem suggestion={suggestion} key={suggestion._links.self.href} />
                    ))}
                </ListGroup>
                <br />
                <h2>{capitalize(t("about"))}</h2>
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
            <footer
                className={"py-3 position-sticky bottom-0 " + styles.student_list_footer}
                style={{ backgroundColor: "#1b1a31" }}
            >
                <Row>
                    <ToastContainer position="bottom-end">
                        <Toast
                            bg="warning"
                            onClose={() => setShow(false)}
                            show={show}
                            delay={timers.toast}
                            data-testid="warning"
                            autohide
                        >
                            <Toast.Body>{capitalize(t("something went wrong"))}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </Row>
                <ButtonGroup className={styles.student_list_button_group}>
                    <SuggestionModal
                        suggestion={SuggestionStrategy.yes}
                        style={{ color: "#1DE1AE", borderColor: "#1DE1AE", width: 150 }}
                        studentUrl={student._links.self.href}
                    />
                    <SuggestionModal
                        suggestion={SuggestionStrategy.maybe}
                        style={{ color: "#FCB70F", borderColor: "#FCB70F", width: 150 }}
                        studentUrl={student._links.self.href}
                    />
                    <SuggestionModal
                        suggestion={SuggestionStrategy.no}
                        style={{ color: "#F14A3B", borderColor: "#F14A3B", width: 150 }}
                        studentUrl={student._links.self.href}
                    />
                    <StudentStatus studentUrl={student._links.self.href} status={student.status} />
                </ButtonGroup>
            </footer>
        </div>
    );
}
