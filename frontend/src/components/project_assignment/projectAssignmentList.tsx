import { Accordion, Container } from "react-bootstrap";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import AccordionItem from "react-bootstrap/AccordionItem";
import apiPaths from "../../properties/apiPaths";
import { getAllProjectsFormPage } from "../../api/calls/projectCalls";
import SkillItem from "./skillItem";
import useSWR from "swr";
import WarningToast from "./warningToast";
import useTranslation from "next-translate/useTranslation";
import {capitalize} from "../../utility/stringUtil";

/**
 * Accordion containing all the information to correctly assign students to projects.
 * @constructor
 */
function ProjectAsignmentList(props: any) {
    const { t } = useTranslation("common");
    let { data, error } = useSWR(apiPaths.projects, getAllProjectsFormPage);
    data = data || [];

    if (error) {
        return (
            <WarningToast
                message={capitalize(t("error reload page"))}
            />
        );
    }

    const projectList = data;

    return (
        <div data-testid="project-assignment-list">
            <Container className="overflow-auto h-100 pt-2">
                <Accordion defaultActiveKey={["0"]} alwaysOpen className={"overflow-auto"}>
                    {projectList.map((project, index) => {
                        return (
                            <AccordionItem key={index} eventKey={`${index}`}>
                                <AccordionHeader className={"bg-secondary"}>
                                    <div>
                                        <h4>{project.name}</h4>
                                        <p>{project.partnerName}</p>
                                    </div>
                                </AccordionHeader>
                                <AccordionBody>
                                    <SkillItem project={project} dropHandler={props.dropHandler} />
                                </AccordionBody>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </Container>
        </div>
    );
}

export default ProjectAsignmentList;
