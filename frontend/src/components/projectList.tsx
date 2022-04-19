import { ListGroup } from "react-bootstrap";
import Router from "next/router";
import styles from "../styles/projectList.module.css";
import { NewProjectButton } from "./newProjectButton";
import useTranslation from "next-translate/useTranslation";
import apiPaths from "../properties/apiPaths";
import { getAllProjectsFormLinks } from "../api/calls/projectCalls";
import useSWR from "swr";
import applicationPaths from "../properties/applicationPaths";

export function ProjectList() {
    const { t } = useTranslation();

    const { data, error } = useSWR(apiPaths.projects, getAllProjectsFormLinks);

    if (error || !data) {
        return null;
    }

    return (
        <div className={styles.project_list}>
            <ListGroup as="ul" className="overflow-scroll">
                <ListGroup.Item data-testid="projectlist-header" className={styles.project_list_header}>
                    {t("common:Project list header")}
                </ListGroup.Item>
                {data
                    .map((project) => ({
                        project,
                        projectId: project._links.self.href.split(apiPaths.projects)[1],
                    }))
                    .map(({ project, projectId }) => (
                        <ListGroup.Item
                            key={projectId}
                            className={styles.project_list_project}
                            action
                            as={"li"}
                            // Should be changed to individual project page later
                            onClick={() => {
                                Router.push(applicationPaths.projects + "/" + projectId);
                            }}
                        >
                            <h5 className="mb-1">{project.name}</h5>
                            <small>{project.partnerName}</small>
                        </ListGroup.Item>
                    ))}
            </ListGroup>
            <NewProjectButton />
        </div>
    );
}
