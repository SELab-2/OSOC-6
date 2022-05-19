import { NextPage } from "next";
import { ProjectInfo } from "../../../components/project/projectInfo";
import { Col, Row } from "react-bootstrap";
import NavBar from "../../../components/util/navBar";
import { ProjectList } from "../../../components/project/projectList";
import styles from "../../../styles/pageGrids.module.css";

const ProjectIDPage: NextPage = () => {
    return (
        <>
            <NavBar />
            <div className={styles.projects} data-testid="projects-grid">
                <Row xs={1} className={"h-100 w-100 gx-0 gx-sm-4"}>
                    <Col sm={3} xxl={2}>
                        <ProjectList />
                    </Col>
                    <Col sm={9} xxl={10}>
                        <ProjectInfo />
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ProjectIDPage;
