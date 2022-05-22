import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../../properties/apiPaths";
import { capitalize } from "../../utility/stringUtil";
import { ButtonGroup, Button, ListGroup, Row, Toast, ToastContainer } from "react-bootstrap";
import { SuggestionStrategy } from "../../api/entities/SuggestionEntity";
import { SuggestionModal } from "../suggestion/suggestionModal";
import { StudentStatus } from "./studentStatus";
import {
    emptyStudent,
    englishProficiencyAsString,
    genderAsString,
    osocExperienceAsString,
} from "../../api/entities/StudentEntity";
import SkillBadge from "../util/skillBadge";
import useSWR from "swr";
import { deleteStudent, extractIdFromStudentUrl, getStudentOnUrl } from "../../api/calls/studentCalls";
import { getAllSuggestionsFromLinks } from "../../api/calls/suggestionCalls";
import SuggestionListItem from "../suggestion/suggestionListItem";
import applicationPaths from "../../properties/applicationPaths";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import Image from "next/image";
import { StatusCodes } from "http-status-codes";
import timers from "../../properties/timers";
import { useState } from "react";
import { getParamsFromQueryUrl, getQueryUrlFromParams } from "../../api/calls/baseCalls";
import styles from "../../styles/students/studentList.module.css";
import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import { getStudentQueryParamsFromQuery } from "./studentFilterComponent";
import { ConfirmDeleteButton } from "../util/confirmDeleteButton";
import { useRouterPush, useRouterReplace } from "../../hooks/routerHooks";

/**
 * Give an overview of all the studentinfo
 */
export function StudentInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const routerAction = useRouterReplace();
    const transformer = useEditionApplicationPathTransformer();
    const isAdmin = useCurrentAdminUser();
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
                await routerAction({ pathname: "/" + applicationPaths.students, query: { ...router.query } });
            } catch (error) {
                setShow(true);
            }
        } else {
            setShow(true);
        }
    }

    async function openCommunications() {
        const studentCommUrl =
            "/" + applicationPaths.students + "/" + id + "/" + applicationPaths.communicationBase;
        await routerAction({ pathname: studentCommUrl, query: { ...router.query } });
    }

    return (
        <div className={"h-100 w-100"}>
            <div className={"overflow-auto p-3"} style={{ height: "calc(100% - 4rem)" }}>
                {isAdmin && (
                    <div className="row w-100" style={{ paddingBottom: 15 }}>
                        <Button
                            variant="btn-outline"
                            data-testid="open-communication"
                            style={{ color: "white", borderColor: "white" }}
                            onClick={openCommunications}
                        >
                            {capitalize(t("communication"))}
                        </Button>
                    </div>
                )}
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
                        {isAdmin && (
                            <>
                                <a
                                    data-testid="edit-student"
                                    href={transformer(
                                        "/" +
                                            applicationPaths.students +
                                            "/" +
                                            extractIdFromStudentUrl(student._links.self.href) +
                                            applicationPaths.studentEdit.split(
                                                applicationPaths.studentInfo
                                            )[1]
                                    )}
                                >
                                    <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                                </a>
                                <ConfirmDeleteButton
                                    dataTestId="delete-student"
                                    handler={deleteStudentOnClick}
                                />
                            </>
                        )}
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
                    {capitalize(t("gender"))}: {capitalize(t(genderAsString[student.gender]))}{" "}
                    {t("with pronouns")} {student.pronouns.toLowerCase()}
                </div>
                <div>
                    {capitalize(t("native language"))}: {student.mostFluentLanguage}
                </div>
                <div>
                    {capitalize(t("english proficiency"))}:{" "}
                    {capitalize(t(englishProficiencyAsString[student.englishProficiency]))}
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
                    {capitalize(t("osoc experience"))}:{" "}
                    {capitalize(t(osocExperienceAsString[student.osocExperience]))}
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
                        colour={"#1DE1AE"}
                        studentUrl={student._links.self.href}
                    />
                    <SuggestionModal
                        suggestion={SuggestionStrategy.maybe}
                        colour={"#FCB70F"}
                        studentUrl={student._links.self.href}
                    />
                    <SuggestionModal
                        suggestion={SuggestionStrategy.no}
                        colour={"#F14A3B"}
                        studentUrl={student._links.self.href}
                    />
                    {isAdmin && (
                        <StudentStatus studentUrl={student._links.self.href} status={student.status} />
                    )}
                </ButtonGroup>
            </footer>
        </div>
    );
}
