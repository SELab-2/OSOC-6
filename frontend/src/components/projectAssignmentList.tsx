import { NextPage } from "next";
import {
    Accordion, Badge,
    CloseButton,
    Col,
    Container,
    Row
} from "react-bootstrap";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import AccordionItem from "react-bootstrap/AccordionItem";
import axios from "axios";
import apiPaths from "../properties/apiPaths";
import {useEffect, useState} from "react";
import {AxiosConf} from "../api/requests";
import {getAllProjects, IProject} from "../api/ProjectEntity";
import { IAssignment, IAssignmentLinks } from "../api/AssignmentEntity";
import { IStudent } from "../api/StudentEntity";
import { IUser } from "../api/UserEntity";
import {IProjectSkill, IProjectSkillLinks} from "../api/ProjectSkillEntity";

export type Assigments = { assignment: IAssignment; student: IStudent; assigner: IUser }[];
export type Skills = {  skill: IProjectSkill, assignments:Assigments }[];


async function getProjectSkills(projectSkillsList:IProjectSkillLinks) {
    const skills: Skills = []

    await Promise.all(
        projectSkillsList._embedded["project-skills"].map(async (skill) => {
            const assignmentList: IAssignmentLinks = (
                await axios.get(skill._links.assignments.href, AxiosConf)
            ).data;

            const assignments: Assigments = await getAssignments(assignmentList);

            skills.push( { skill, assignments })
        })
    );

    return skills
}


async function getAssignments(assignmentList:IAssignmentLinks) {
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

    return assignments
}

async function getProjectAssignemntData(): Promise<{ project: IProject; skills: Skills }[]> {
    const projects: IProject[] = await getAllProjects(apiPaths.projects);
    const reply: { project: IProject; skills: Skills }[] = [];

    await Promise.all(
        projects.map(async (project) => {
            const projectSkillsList: IProjectSkillLinks = (
                await axios.get(project._links.neededSkills.href, AxiosConf)
            ).data;
            const skills: Skills = await getProjectSkills(projectSkillsList);

            reply.push({ project, skills });
        })
    );

    return reply;
}

const ProjectAsignmentList: NextPage = () => {
    const [projects, setProjects] = useState<{ project: IProject; skills: Skills }[]>();
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
                                    <SkillItem skills={item.skills} />
                                </AccordionBody>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </Container>
        </>
    );
};

export function SkillItem(item: { skills: Skills }) {
    const skills = item.skills;
    const [skillList, setSkillList] = useState<Skills>();
    useEffect(() => setSkillList(skills), [skills]);

    if (skillList != undefined) {
        if (skillList.length == 0) {
            return <p>No skills have been assigned to this project</p>;
        }

        return (
            <>
                {skillList.map((skill, index) => {
                    return (
                        <Container key={index}>
                            <AssignmentItem skill={ skill.skill } assignments={skill.assignments}/>
                        </Container>
                    );
                })}
            </>
        );
    }
    return <p>Loading...</p>;
}


function AssignmentItem(item: { skill: IProjectSkill, assignments:Assigments }) {
    const assignments = item.assignments;
    const [assign, setAssign] = useState<Assigments>();
    useEffect(() => setAssign(assignments), [assignments]);

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
            return <p >No students have been assigned to this skill</p>;
        }

        return (
            <>
                {assign.map((assignment, index) => {
                    return (
                        <div key={index}>
                            <Row className={"align-items-center"} xs={2}>
                                <Col sm={11}>
                                    <h6>{assignment.student.firstName} <Badge bg={"secondary"}>{item.skill.name}</Badge></h6>
                                    <p>Suggested by {assignment.assigner.callName}: <br />{" "}
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

    return <p>Loading...</p>
}


export default ProjectAsignmentList;
