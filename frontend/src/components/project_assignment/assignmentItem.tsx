import { IProjectSkill } from "../../api/ProjectSkillEntity";
import { useEffect, useState } from "react";
import axios from "axios";
import { AxiosConf } from "../../api/requests";
import { Badge, CloseButton, Col, Row } from "react-bootstrap";
import { IAssignment, IAssignmentLinks } from "../../api/AssignmentEntity";
import { IStudent } from "../../api/StudentEntity";
import { IUser } from "../../api/UserEntity";

export type Assigments = { assignment: IAssignment; student: IStudent; assigner: IUser }[];

async function getAssignments(assignmentList: IAssignmentLinks) {
    const assignments: Assigments = [];

    await Promise.all(
        assignmentList._embedded.assignments.map(async (assignment) => {
            const student: IStudent = (await axios.get(assignment._links.student.href, AxiosConf))
                .data;

            const assigner: IUser = (await axios.get(assignment._links.assigner.href, AxiosConf))
                .data;

            if (assignment.isValid) {
                assignments.push({ assignment, student, assigner });
            }
        })
    );

    return assignments;
}

async function getLinks(item: { skill: IProjectSkill }) {
    const assignmentList: IAssignmentLinks = (
        await axios.get(item.skill._links.assignments.href, AxiosConf)
    ).data;
    return await getAssignments(assignmentList);
}

function AssignmentItem(item: { skill: IProjectSkill }) {
    const [assign, setAssign] = useState<Assigments>();
    useEffect(() => {
        getLinks(item).then((assignments) => setAssign(assignments));
    }, [item]);

    async function removeAssignment(event: any) {
        console.log(event);
        await axios.delete(event.target.value, AxiosConf);
        if (assign != undefined) {
            const assignments: Assigments = [];
            for (let assignment of assign) {
                if (assignment.assignment._links.assignment.href != event.target.value) {
                    assignments.push(assignment);
                }
            }
            setAssign(assignments);
        }
    }

    if (assign != undefined) {
        if (assign.length == 0) {
            return <p>No students have been assigned to this skill</p>;
        }

        return (
            <>
                {assign.map((assignment, index) => {
                    return (
                        <div key={index}>
                            <Row className={"align-items-center"} xs={2}>
                                <Col sm={11}>
                                    <h6>
                                        {assignment.student.firstName}{" "}
                                        <Badge bg={"secondary"}>{item.skill.name}</Badge>
                                    </h6>
                                    <p>
                                        Suggested by {assignment.assigner.callName}: <br />{" "}
                                        {assignment.assignment.reason}
                                    </p>
                                </Col>
                                <Col sm={1}>
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

    return <p>Loading...</p>;
}

export default AssignmentItem;
