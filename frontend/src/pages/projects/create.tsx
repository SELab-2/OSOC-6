import type { NextPage } from "next";
import NavBar from "../../components/util/navBar";
import styles from "../../styles/projects/createProject.module.css";
import { ProjectForm } from "../../components/project/projectForm";
import { ProjectFormSubmitHandler } from "../../handlers/projectFormSubmitHandler";

const CreateProject: NextPage = () => {
    return (
        <div>
            <NavBar />
            <div className={styles.create_form_container}>
                <ProjectForm submitHandler={ProjectFormSubmitHandler} />
            </div>
        </div>
    );
};

export default CreateProject;
