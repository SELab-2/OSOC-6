import { NextPage } from "next";
import styles from "../../../styles/pageGrids.module.css";
import NavBar from "../../../components/util/navBar";
import { ProjectList } from "../../../components/project/projectList";
import { ProjectInfo } from "../../../components/project/projectInfo";

/**
 * Page dedicated to showing info about a project.
 */
const ProjectIDPage: NextPage = () => {
    return (
        <>
            <NavBar />
            <div className={styles.info_grid} data-testid="projects-grid">
                <div className={styles.sidebar}>
                    <ProjectList />
                </div>
                <div className={styles.info_field}>
                    <ProjectInfo />
                </div>
            </div>
        </>
    );
};

export default ProjectIDPage;
