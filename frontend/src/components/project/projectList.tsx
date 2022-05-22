import { ListGroup } from "react-bootstrap";
import styles from "../../styles/projects/projectList.module.css";
import { NewProjectButton } from "./newProjectButton";
import useTranslation from "next-translate/useTranslation";
import apiPaths from "../../properties/apiPaths";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import { useRouter } from "next/router";
import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import useProjectsByEdition from "../../hooks/useProjectsByEdition";

export function ProjectList() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    const currentUserIsAdmin = useCurrentAdminUser();

    const { data: receivedProjects, error: projectsError } = useProjectsByEdition();
    const projects = receivedProjects || [];

    if (projectsError) {
        console.log(projectsError);
        return null;
    }

    return (
        <div className={styles.project_list} data-testid="project-list" id={"project-list"}>
            <ListGroup as="ul" className={"overflow-auto " + styles.project_list_list_group} role={"tablist"}>
                <ListGroup.Item data-testid="projectlist-header" className={styles.project_list_header}>
                    <div className="capitalize">{t("projects")}</div>
                </ListGroup.Item>
                {projects
                    .map((project) => ({
                        project,
                        projectId: project._links.self.href.split(apiPaths.base)[1],
                    }))
                    .map(({ project, projectId }) => (
                        <ListGroup.Item
                            key={projectId}
                            className={"proj " + styles.project_list_project}
                            action
                            as={"a"}
                            onClick={() => {
                                let projectPath: string = projectId;
                                router
                                    .push(transformer("/" + projectPath) + "#/" + projectId)
                                    .catch(console.log);
                            }}
                            href={"#" + projectId}
                            role="tab"
                            data-toggle="list"
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
            {currentUserIsAdmin && <NewProjectButton />}
        </div>
    );
}
