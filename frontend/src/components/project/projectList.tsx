import { ListGroup } from "react-bootstrap";
import styles from "../../styles/projectList.module.css";
import { NewProjectButton } from "./newProjectButton";
import useTranslation from "next-translate/useTranslation";
import apiPaths from "../../properties/apiPaths";
import { getAllProjectsFormPage } from "../../api/calls/projectCalls";
import { useEditionApplicationPathTransformer, useSwrWithEdition } from "../../hooks/utilHooks";
import { useRouter } from "next/router";

export function ProjectList() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();

    let { data, error } = useSwrWithEdition(apiPaths.projectsByEdition, getAllProjectsFormPage);
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
                            <div className={styles.project_list_info}>
                                <h5 className="mb-1">{project.name}</h5>
                                <small>{project.partnerName}</small>
                            </div>
                            <div className={styles.project_list_chevron}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-chevron-right"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                    />
                                </svg>
                            </div>
                        </ListGroup.Item>
                    ))}
            </ListGroup>
            <NewProjectButton />
        </div>
    );
}
