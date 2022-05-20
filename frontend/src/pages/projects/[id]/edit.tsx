import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../../../styles/Home.module.css";
import NavBar from "../../../components/util/navBar";
import { ProjectForm } from "../../../components/project/projectForm/projectForm";
import { projectFormSubmitHandler } from "../../../handlers/projectFormSubmitHandler";
import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getProjectOnUrl } from "../../../api/calls/projectCalls";
import { emptyProject, IProject } from "../../../api/entities/ProjectEntity";

const CreateProject: NextPage = () => {
    const { t } = useTranslation("common");
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
        <div>
            <Head>
                <title className="capitalize">{t("home page title")}</title>
            </Head>
            <NavBar />
            <main className={styles.main}>
                <div className="capitalize  m-4">
                    <h1 className={styles.title}>{"edit project " + project.name}</h1>
                    <ProjectForm project={project} />
                </div>
            </main>
        </div>
    );
};

export default CreateProject;
