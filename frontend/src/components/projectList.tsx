import { ListGroup } from "react-bootstrap";
import styles from "../styles/projectList.module.css";
import { NewProjectButton } from "./newProjectButton";
import useTranslation from "next-translate/useTranslation";
import apiPaths from "../properties/apiPaths";
import { getAllProjectsFormPage } from "../api/calls/projectCalls";
import { useEditionPathTransformer, useSwrWithEdition } from "../hooks/utilHooks";
import { useRouter } from "next/router";

export function ProjectList() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionPathTransformer();

    let { data, error } = useSwrWithEdition(apiPaths.projects, getAllProjectsFormPage);
    data = data || [];

    if (error) {
        console.log(error);
        return null;
    }

    return (
        <div className={styles.project_list} data-testid="project-list">
            <ListGroup as="ul" className="overflow-auto">
                <ListGroup.Item data-testid="projectlist-header" className={styles.project_list_header}>
                    <div className="capitalize">{t("projects")}</div>
                </ListGroup.Item>
                {data
                    .map((project) => ({
                        project,
                        projectId: project._links.self.href.split(apiPaths.base)[1],
                    }))
                    .map(({ project, projectId }) => (
                        <ListGroup.Item
                            key={projectId}
                            className={styles.project_list_project}
                            action
                            as={"li"}
                            onClick={() => {
                                let projectPath: string = projectId;
                                router.push(transformer("/" + projectPath)).catch(console.log);
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
