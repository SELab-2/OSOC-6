import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { CreateProjectForm } from "../../components/project/createProjectForm";
import { createProjectSubmitHandler } from "../../handlers/createProjectSubmitHandler";
import NavBar from "../../components/util/navBar";
import styles from "../../styles/projects/createProject.module.css";

const CreateProject: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <NavBar />
            <div className={styles.create_form_container}>
                <CreateProjectForm submitHandler={createProjectSubmitHandler} />
            </div>
        </div>
    );
};

export default CreateProject;
