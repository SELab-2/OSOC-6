import { NextPage } from "next";
import { Accordion, CloseButton, Col, Container, Row } from "react-bootstrap";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import AccordionItem from "react-bootstrap/AccordionItem";
import axios from "axios";
import pathNames from "../properties/pathNames";
import { useEffect, useState } from "react";
import { AxiosConf } from "../api/requests";
import { IProject } from "../api/ProjectEntity";
import { IAssignment, IAssignmentLinks } from "../api/AssignmentEntity";
import { IStudent } from "../api/StudentEntity";
import { IUser } from "../api/UserEntity";
import { IBaseEntity, IPage } from "../api/BaseEntities";

export type Assigments = { assignment: IAssignment; student: IStudent; assigner: IUser }[];

async function getAllEntities<T extends IBaseEntity>(
    url: string,
    collectionName: string
): Promise<T[]> {
    let fetchedAll: boolean = false;
    let currentPage: number = 0;
    let entities: T[] = [];

    while (!fetchedAll) {
        let page: IPage<any>;
        page = (
            await axios.get(url, {
                params: {
                    size: 1000,
                    page: currentPage,
                },
                ...AxiosConf,
            })
        ).data;
        console.log(page);
        entities.push(...page._embedded[collectionName]);
        fetchedAll = currentPage + 1 === page.page.totalPages;
        currentPage++;
    }

    return entities;
}

async function getProjectAssignemntData(): Promise<
    { project: IProject; assignments: Assigments }[]
> {
    const projects: IProject[] = await getAllEntities<IProject>(pathNames.projects, "projects");
    const reply: { project: IProject; assignments: Assigments }[] = [];
    await Promise.all(
        projects.map(async (project) => {
            const assignmentList: IAssignmentLinks = (
                await axios.get(project._links.assignments.href, AxiosConf)
            ).data;
            const assignments: Assigments = [];
            await Promise.all(
                assignmentList._embedded.assignments.map(async (assignment) => {
                    const student: IStudent = (
                        await axios.get(assignment._links.student.href, AxiosConf)
                    ).data;
                    const assigner: IUser = (
                        await axios.get(assignment._links.assigner.href, AxiosConf)
                    ).data;
                    if (assignment.isValid) {
                        assignments.push({ assignment, student, assigner });
                    }
                })
            );
            reply.push({ project, assignments });
        })
    );
    return reply;
}

const ProjectAsignmentList: NextPage = () => {
    const [projects, setProjects] = useState<{ project: IProject; assignments: Assigments }[]>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getProjectAssignemntData().then((reply) => {
            setProjects(reply);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <h3>Loading ...</h3>;
    }

    const projectList = projects!;

    return (
        <>
            <Container>
                <Accordion
                    defaultActiveKey={["0"]}
                    alwaysOpen
                    className={"w-75 overflow-auto"}
                    style={{ height: "20em" }}
                >
                    {projectList.map((item, index) => {
                        console.log("item");
                        console.log(item);
                        return (
                            <AccordionItem key={index} eventKey={`${index}`}>
                                <AccordionHeader>
                                    <div>
                                        <h4>{item.project.name}</h4>
                                        <p>{item.project.partnerName}</p>
                                    </div>
                                </AccordionHeader>
                                <AccordionBody>
                                    <AssignmentItem assignments={item.assignments} />
                                </AccordionBody>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </Container>
        </>
    );
};

export function AssignmentItem(item: { assignments: Assigments }) {
    const assignments = item.assignments;
    const [assign, setAssign] = useState<Assigments>();
    useEffect(() => setAssign(assignments), [assignments]);

    async function removeAssignment(assignment: any) {
        await axios.delete(assignment.target.value, AxiosConf);
        if (assign != undefined) {
            const newAssign: Assigments = [];
            for (let ass of assign) {
                if (ass.assignment._links.assignment.href != assignment.target.value) {
                    newAssign.push(ass);
                }
            }
            setAssign(newAssign);
        }
    }

    if (assign != undefined) {
        if (assign.length == 0) {
            return <p>No students have been assigned to this project</p>;
        }

        return (
            <>
                {assign.map((assignment, index) => {
                    return (
                        <Container key={index}>
                            <Row className={"align-items-center"} xs={2}>
                                <Col sm={11}>
                                    <h6>{assignment.student.firstName}</h6>
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
                        </Container>
                    );
                })}
            </>
        );
    }
    return <p>Loading...</p>;
}

export default ProjectAsignmentList;
