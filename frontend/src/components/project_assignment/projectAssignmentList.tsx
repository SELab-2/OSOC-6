import { NextPage } from "next";
import { Accordion, Container } from "react-bootstrap";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import AccordionItem from "react-bootstrap/AccordionItem";
import apiPaths from "../../properties/apiPaths";
import { useEffect, useState } from "react";
import { getAllProjects, IProject } from "../../api/ProjectEntity";
import SkillItem from "./skillItem";

async function getProjectAssignemntData(): Promise<{ project: IProject }[]> {
    const projects: IProject[] = await getAllProjects(apiPaths.projects);
    const reply: { project: IProject }[] = [];

    await Promise.all(
        projects.map(async (project) => {
            reply.push({ project });
        })
    );

    return reply;
}

const ProjectAsignmentList: NextPage = () => {
    const [projects, setProjects] = useState<{ project: IProject }[]>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        /*
            setInterval(() => {
*/
        getProjectAssignemntData().then((reply) => {
            setProjects(reply);
            setLoading(false);
        });
        /*console.log("reload");
        }, 10000)*/
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
                        return (
                            <AccordionItem key={index} eventKey={`${index}`}>
                                <AccordionHeader>
                                    <div>
                                        <h4>{item.project.name}</h4>
                                        <p>{item.project.partnerName}</p>
                                    </div>
                                </AccordionHeader>
                                <AccordionBody>
                                    <SkillItem project={item.project} />
                                </AccordionBody>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </Container>
        </>
    );
};

export default ProjectAsignmentList;
