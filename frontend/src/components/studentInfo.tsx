import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import apiPaths from "../properties/apiPaths";
import useSWR from "swr";
import {getAllStudentInfo, getStudentOnUrl} from "../api/calls/studentCalls";
import { capitalize } from "../utility/stringUtil";
import {ListGroup} from "react-bootstrap";

export function StudentInfo() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query as { id: string };

    const { data, error } = useSWR(apiPaths.students + "/" + id, getAllStudentInfo);

    if (error || !data) {
        return null;
    }

    return (
        <div>
            <div className="row">
                <div className="col-sm-4"><h1>{data.student.callName}</h1></div>
                <div className="col-sm-8"><div>Positions</div></div>
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

                        <ListGroup.Item
                            key={suggestionId}
                            as={"li"}
                        >
                            <div>{suggestion.coach.callName}: {suggestion.suggestion.reason}</div>
                        </ListGroup.Item>
                    ))}
            </ListGroup>
            <br />
            <h2>{capitalize(t("student about"))}</h2>
            <a href={data.student.curriculumVitaeURI}>{capitalize(t("student cv"))}</a> <br/>
            <a href={data.student.portfolioURI}>{capitalize(t("student portfolio"))}</a> <br/>
            <a href={data.student.motivationURI}>{capitalize(t("student motivation"))}</a> <br/>
            <br />
            <h2>{capitalize(t("student education"))}</h2>
            <div>Currently in {data.student.yearInCourse} year of {data.student.studies} at {data.student.institutionName}.</div>
            <div>Has already obtained {data.student.currentDiploma}.</div>
        </div>
    );
}
