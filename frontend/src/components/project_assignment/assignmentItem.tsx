import { IProjectSkill } from "../../api/entities/ProjectSkillEntity";
import { Badge, CloseButton, Col, Row } from "react-bootstrap";
import useSWR, { useSWRConfig } from "swr";
import { deleteAssignment, getAssignments } from "../../api/calls/AssignmentCalls";
import WarningToast from "./warningToast";
import apiPaths from "../../properties/apiPaths";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { getSkillTypeFromSkill } from "../../api/calls/skillTypeCalls";
import { useEffect, useState } from "react";

/**
 * An item containing the information about the assignments to a skill of a project.
 * It contains the name of the skill followed by a list of assignments for that skill.
 * The list contains the first name of the student, the name of the person that did the assignment and the motivation.
 * Furthermore, it contains a delete button to delete the assignment.
 * @param item Skill you want the assignments from
 * @constructor
 */
function AssignmentItem(item: { skill: IProjectSkill }) {
    const { t } = useTranslation("common");

    const [color, setColor] = useState("secondary");
    useEffect(() => {
        getSkillTypeFromSkill(item.skill).then((skillType) => setColor(skillType.colour));
    });

    const { mutate } = useSWRConfig();
    let { data, error } = useSWR(item.skill._links.assignments.href, getAssignments, {
        refreshInterval: 10,
    });
    let assign = data || [];

    if (error) {
        return <WarningToast message={capitalize(t("error reload page"))} />;
    }

    async function removeAssignment(event: any) {
        await deleteAssignment(event.target.value, assign);
        await mutate(item.skill._links.assignments.href);
    }

    if (assign.length == 0) {
        return (
            <div>
                <Badge bg="" style={{ background: color }}>
                    {item.skill.name}
                </Badge>
                <p>{capitalize(t("no users for skill"))}</p>
            </div>
        );
    }

    return (
        <>
            <Badge bg="" style={{ backgroundColor: color }}>
                {item.skill.name}
            </Badge>
            {assign.map((assignment, index) => {
                return (
                    <div key={index}>
                        <Row className={"align-items-center"}>
                            <Col xs={10} md={11}>
                                <a
                                    rel="noreferrer"
                                    href={assignment.student._links.self.href.split(apiPaths.base)[1]}
                                    target="_blank"
                                >
                                    <h6>{assignment.student.firstName}</h6>
                                </a>
                                <p>
                                    {capitalize(t("suggested by"))}
                                    {assignment.assigner.callName}: <br /> {assignment.assignment.reason}
                                </p>
                            </Col>
                            <Col xs={2} md={1}>
                                <CloseButton
                                    aria-label={"Remove student from project"}
                                    value={assignment.assignment._links.assignment.href}
                                    onClick={(assignment) => removeAssignment(assignment)}
                                />
                            </Col>
                        </Row>
                        <hr />
                    </div>
                );
            })}
        </>
    );
}

export default AssignmentItem;
