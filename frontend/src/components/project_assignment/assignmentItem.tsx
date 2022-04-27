import { IProjectSkill } from "../../api/ProjectSkillEntity";
import { useEffect, useState } from "react";
import axios from "axios";
import { AxiosConf } from "../../api/requests";
import { Badge, CloseButton, Col, Row } from "react-bootstrap";
import { IAssignment, IAssignmentLinks } from "../../api/AssignmentEntity";
import { IStudent } from "../../api/StudentEntity";
import { IUser } from "../../api/UserEntity";

type Assignments = { assignment: IAssignment; student: IStudent; assigner: IUser }[];

async function getAssignments(assignmentList: IAssignmentLinks): Promise<Assignments> {
    let assignments: Assignments = [];
    const assigners: { [url: string]: IUser } = {};
    const students: { [url: string]: IStudent } = {};

    if (assignmentList == undefined) {
        return assignments;
    }

    await Promise.all(
        assignmentList._embedded.assignments.map(async (assignment) => {
            if (assignment.isValid) {
                const studentURL = assignment._links.student.href;
                const assignerURL = assignment._links.assigner.href;

                let student: IStudent;
                if (students[studentURL] == undefined) {
                    student = (await axios.get(studentURL, AxiosConf)).data;
                    students[studentURL] = student;
                } else {
                    student = students[studentURL];
                }

                let assigner: IUser;
                if (assigners[assignerURL] == undefined) {
                    assigner = (await axios.get(assignerURL, AxiosConf)).data;
                    assigners[assignerURL] = assigner;
                } else {
                    assigner = assigners[assignerURL];
                }
                assignments.push({ assignment, student, assigner });
            }
        })
    );

    sortAssignments(assignments);

    return assignments;
}

function sortAssignments(assignments: Assignments) {
    assignments.sort((assignment1, assignment2) => {
        if (assignment1.student.firstName > assignment2.student.firstName) {
            return 1;
        }

        if (assignment1.student.firstName < assignment2.student.firstName) {
            return -1;
        }

        if (assignment1.assigner.username > assignment2.assigner.username) {
            return 1;
        }

        if (assignment1.assigner.username < assignment2.assigner.username) {
            return -1;
        }

        return 0;
    });
}

async function deleteAssignment(assignmentURL: string, oldAssignments: Assignments): Promise<Assignments> {
    await axios.delete(assignmentURL, AxiosConf);
    const assignments: Assignments = [];
    for (let assignment of oldAssignments) {
        if (assignment.assignment._links.assignment.href != assignmentURL) {
            assignments.push(assignment);
        }
    }
    return assignments;
}

async function getLinks(item: { skill: IProjectSkill }): Promise<Assignments> {
    const assignmentList: IAssignmentLinks = (await axios.get(item.skill._links.assignments.href, AxiosConf))
        .data;
    return await getAssignments(assignmentList);
}

function AssignmentItem(item: { skill: IProjectSkill }) {
    const [assign, setAssign] = useState<Assignments>();
    useEffect(() => {
        getLinks(item).then((assignments) => setAssign(assignments));
    }, [item]);

    async function removeAssignment(event: any) {
        if (assign != undefined) {
            const assignments = await deleteAssignment(event.target.value, assign);
            setAssign(assignments);
        }
    }

    if (assign != undefined) {
        if (assign.length == 0) {
            return (
                <div>
                    <Badge bg={"secondary"}>{item.skill.name}</Badge>
                    <p>No students have been assigned for this skill.</p>
                </div>
            );
        }

        return (
            <>
                <Badge bg={"secondary"}>{item.skill.name}</Badge>
                {assign.map((assignment, index) => {
                    return (
                        <div key={index}>
                            <Row className={"align-items-center"}>
                                <Col xs={10} md={11}>
                                    <h6>{assignment.student.firstName} </h6>
                                    <p>
                                        Suggested by {assignment.assigner.callName}: <br />{" "}
                                        {assignment.assignment.reason}
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

    return <p>Loading...</p>;
}

export default AssignmentItem;
