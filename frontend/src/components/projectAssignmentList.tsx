import { NextPage } from "next";
import { Accordion } from "react-bootstrap";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import AccordionItem from "react-bootstrap/AccordionItem";
import axios from "axios";
import pathNames from "../properties/pathNames";
import { useEffect, useState } from "react";
import { AxiosConf } from "../api/requests";
import { IProject, IProjectPage } from "../api/ProjectEntity";
import { IAssignmentPage } from "../api/AssignmentEntity";

const ProjectAsignmentList: NextPage = () => {
    const [projects, setProjects] =
        useState<{ project: IProject; assignments: IAssignmentPage }[]>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProjects() {
            const response: IProjectPage = (await axios.get(pathNames.projects, AxiosConf)).data;
            const reply: { project: IProject; assignments: IAssignmentPage }[] = [];
            await Promise.all(
                response._embedded.projects.map(async (project) => {
                    const assignments: IAssignmentPage = (
                        await axios.get(project._links.assignments.href, AxiosConf)
                    ).data;
                    reply.push({ project, assignments });
                })
            );
            setProjects(reply);
            setLoading(false);
        }
        fetchProjects();
    }, []);

    if (loading) {
        return <h3>Loading ...</h3>;
    }

    console.log(projects);

    const projectList = projects!;
    console.log("Projectlist");
    console.log(projectList.length);

    return (
        <>
            <Accordion defaultActiveKey={["0"]} alwaysOpen>
                {projectList.map((item, index) => {
                    console.log("item");
                    console.log(item);
                    return (
                        <AccordionItem key={index} eventKey={`${index}`}>
                            <AccordionHeader>
                                <div>
                                    <h3>{item.project.name}</h3>
                                    <p>{item.project.partnerName}</p>
                                </div>
                            </AccordionHeader>
                            <AccordionBody>
                                {item.assignments._embedded.assignments.map((assignment, index) => {
                                    return (
                                        <div key={index}>
                                            <h6>{assignment._links.student.href}</h6>
                                            <p>{assignment.reason}</p>
                                        </div>
                                    );
                                })}
                            </AccordionBody>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </>
    );
};

export default ProjectAsignmentList;
