import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import NavBar from "../../components/navBar";
import { ProjectList } from "../../components/projectList";
import styles from "../../styles/pageGrids.module.css";

const ProjectPage: NextPage = () => {
    return (
        <>
            <NavBar />
            <div className={styles.projects} data-testid="projects-grid">
                <Row xs={1} className={"h-100 w-100 gx-0 gx-sm-4"}>
                    <Col sm={3} xxl={2}>
                        <ProjectList />
                    </Col>
                    <Col sm={9} xxl={10} className={"d-flex justify-content-center align-items-center"}>
                        <p data-testid="projects-select-message">select a project to start</p>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ProjectPage;
