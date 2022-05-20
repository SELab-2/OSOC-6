import { NextPage } from "next";
import NavBar from "../../components/util/navBar";
import { ProjectList } from "../../components/project/projectList";
import styles from "../../styles/pageGrids.module.css";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";

const ProjectPage: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <>
            <NavBar />
            <div className={styles.info_grid} data-testid="projects-grid">
                <div className={styles.sidebar}>
                    <ProjectList />
                </div>
                <div className={"d-flex justify-content-center align-items-center " + styles.info_field}>
                    <p data-testid="projects-select-message">{capitalize(t("select a project to start"))}</p>
                </div>
            </div>
        </>
    );
};

export default ProjectPage;
