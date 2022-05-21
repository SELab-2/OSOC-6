import type { NextPage } from "next";
import NavBar from "../../components/util/navBar";
import styles from "../../styles/projects/createProject.module.css";
import { ProjectForm } from "../../components/project/projectForm/projectForm";

/**
 * Page dedicated to creating a project.
 * @constructor
 */
const CreateProject: NextPage = () => {
    return (
        <div>
            <NavBar />
            <div className={styles.create_form_container}>
                <ProjectForm />
            </div>
        </div>
    );
};

export default CreateProject;
