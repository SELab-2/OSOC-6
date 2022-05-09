import { IProjectSkill } from "../../api/entities/ProjectSkillEntity";
import { Badge, CloseButton, Col, Row } from "react-bootstrap";
import useSWR, { useSWRConfig } from "swr";
import { deleteAssignment, getAllAssignmentsFormLinks } from "../../api/calls/AssignmentCalls";
import WarningToast from "../warningToast";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { useEffect, useState } from "react";
import applicationPaths from "../../properties/applicationPaths";
import { extractIdFromStudentUrl } from "../../api/calls/studentCalls";
import useSkillTypeByName from "../../hooks/useSkillTypeByName";
import { emptySkillType, ISkillType } from "../../api/entities/SkillTypeEntity";
import { IAssignment } from "../../api/entities/AssignmentEntity";
import AssignmentStudentRow from "./assignmentStudentRow";

export interface IAssignmentItemProps {
    skill: IProjectSkill;
}

/**
 * An item containing the information about the assignments to a skill of a project.
 * It contains the name of the skill followed by a list of assignments for that skill.
 * The list contains the first name of the student, the name of the person that did the assignment and the motivation.
 * Furthermore, it contains a delete button to delete the assignment.
 * @param skill [IProjectSkill] you want the assignments from
 * @constructor
 */
function AssignmentItem({ skill }: IAssignmentItemProps) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();
    const { data: resSkillType, error: skillTypeError } = useSkillTypeByName(skill.name);
    const { data: resAssignments, error: assignmentsError } = useSWR(
        skill._links.assignments.href,
        getAllAssignmentsFormLinks
    );

    if (skillTypeError || assignmentsError) {
        return <WarningToast message={capitalize(t("error reload page"))} />;
    }

    const skillType: ISkillType = resSkillType || emptySkillType;
    const assignments: IAssignment[] = resAssignments || [];

    async function removeAssignment(assignmentUrl: string) {
        const newAssignments = await deleteAssignment(assignmentUrl, assignments);
        await mutate(skill._links.assignments.href, newAssignments);
    }

    if (assignments.length === 0) {
        return (
            <div data-testid="assignment-item">
                <Badge bg="" style={{ background: skillType.colour }}>
                    {skill.name}
                </Badge>
                <p>{capitalize(t("no users for skill"))}</p>
            </div>
        );
    }

    return (
        <div data-testid="assignment-item">
            <Badge bg="" style={{ backgroundColor: skillType.colour }}>
                {skill.name}
            </Badge>
            {assignments.map((assignment) => (
                <div key={assignment._links.self.href}>
                    <AssignmentStudentRow assignment={assignment} removeCallback={removeAssignment} />
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default AssignmentItem;
