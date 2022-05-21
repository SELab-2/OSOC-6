import { Accordion, Container } from "react-bootstrap";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import AccordionItem from "react-bootstrap/AccordionItem";
import apiPaths from "../../properties/apiPaths";
import { getAllProjectsFromPage } from "../../api/calls/projectCalls";
import AssignmentSkillList from "./assignmentSkillList";
import useSWR from "swr";
import WarningToast from "../util/warningToast";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { DropHandler } from "../../pages/assignStudents";
import { useSwrWithEdition } from "../../hooks/utilHooks";
import styles from "../../styles/assignments.module.css";

/**
 * Accordion containing all the information to correctly assign students to projects.
 * @constructor
 */
function ProjectAsignmentList(props: { dropHandler: DropHandler }) {
    const { t } = useTranslation("common");
    let { data, error } = useSwrWithEdition(apiPaths.projectsByEdition, getAllProjectsFromPage);
    data = data || [];
    if (error) {
        return <WarningToast message={capitalize(t("error reload page"))} />;
    }

    const projectList = data;

    if (data.length === 0) {
        return (
            <div
                className="d-flex justify-content-center align-items-center h-100"
                data-testid="project-assignment-list"
            >
                <p>{capitalize(t("no projects"))}</p>
            </div>
        );
    }

    return (
        <div data-testid="project-assignment-list">
            <Container className="overflow-auto h-100 pt-2">
                <Accordion
                    defaultActiveKey={["0"]}
                    alwaysOpen
                    className={"overflow-auto " + styles.accordion}
                >
                    {projectList.map((project, index) => {
                        return (
                            <AccordionItem
                                key={index}
                                eventKey={`${index}`}
                                data-testid="project"
                                className={styles.accordion_item}
                            >
                                <AccordionHeader className={"bg-secondary"}>
                                    <div>
                                        <h4>{project.name}</h4>
                                        <p>{project.partnerName}</p>
                                    </div>
                                </AccordionHeader>
                                <AccordionBody>
                                    <AssignmentSkillList
                                        projectURL={project._links.self.href}
                                        dropHandler={props.dropHandler}
                                    />
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
