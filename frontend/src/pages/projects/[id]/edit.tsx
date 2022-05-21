import type { NextPage } from "next";
import styles from "../../../styles/Home.module.css";
import NavBar from "../../../components/util/navBar";
import { ProjectForm } from "../../../components/project/projectForm/projectForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getProjectOnUrl } from "../../../api/calls/projectCalls";
import { emptyProject, IProject } from "../../../api/entities/ProjectEntity";
import { Background } from "../../../components/util/background";

/**
 * Page dedicated to editing a project.
 */
const EditProjectPage: NextPage = () => {
    const router = useRouter();
    const query = router.query as { id: string };
    const projectId = query.id;

    const { data: receivedProject, error: projectError } = useSWR(
        apiPaths.projects + "/" + projectId,
        getProjectOnUrl
    );

    if (projectError) {
        console.log(projectError);
        return null;
    }

    const project: IProject = receivedProject || emptyProject;

    return (
        <div data-testid="edit-project-page">
            <NavBar />
            <Background />
            <div className={styles.create_form_container}>
                <ProjectForm project={project} />
            </div>
        </div>
    );
};

export default EditProjectPage;
