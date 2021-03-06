import { Button, ListGroup } from "react-bootstrap";
import styles from "../../styles/projects/projectList.module.css";
import { NewProjectButton } from "./newProjectButton";
import useTranslation from "next-translate/useTranslation";
import apiPaths from "../../properties/apiPaths";
import { extractIdFromProjectUrl, getAllProjectsFromPage } from "../../api/calls/projectCalls";
import { useEditionApplicationPathTransformer, useSwrWithEdition } from "../../hooks/utilHooks";
import { useRouter } from "next/router";
import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import useProjectsByEdition from "../../hooks/useProjectsByEdition";
import { useRouterPush } from "../../hooks/routerHooks";
import applicationPaths from "../../properties/applicationPaths";

export function ProjectList() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const query = router.query as { id?: string };
    const selectedProjectId = query.id;
    const routerAction = useRouterPush();
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
                        projectId: extractIdFromProjectUrl(project._links.self.href),
                    }))
                    .map(({ project, projectId }) => (
                        <ListGroup.Item
                            key={projectId}
                            className={
                                "proj " + projectId === selectedProjectId
                                    ? "active "
                                    : "" + styles.project_list_project
                            }
                            action
                            as={"a"}
                            onClick={async () => {
                                await routerAction({
                                    pathname: "/" + applicationPaths.projects + "/" + projectId,
                                });
                            }}
                            href={undefined}
                            role="tab"
                            data-testid={"project-select-" + project.name}
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
            {currentUserIsAdmin && (
                <>
                    <div className={"container " + styles.bottom_page}>
                        <div className="row">
                            <NewProjectButton />
                        </div>
                        <div className="row">
                            <Button
                                data-testid="skill-types-button"
                                className={"capitalize justify-content-center " + styles.project_list_button}
                                variant="outline-primary"
                                size="sm"
                                onClick={() => routerAction("/" + applicationPaths.skillTypesBase)}
                            >
                                {t("skill types")}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
