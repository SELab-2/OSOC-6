import { NextPage } from "next";
import { Col, Row } from "react-bootstrap";
import NavBar from "../../components/navBar";
import styles from "../../styles/pageGrids.module.css";

const StudentsPage: NextPage = () => {
    return (
        <>
            <NavBar />
            <div className={styles.projects}>
                <Row className="gx-0 h-25 w-100">
                    {/* Replace this div with the correct component */}
                    <div
                        className={
                            "d-flex justify-content-center align-items-center h-100 " + styles.placeholder
                        }
                    >
                        <p>Student filter placeholder</p>
                    </div>
                </Row>
                <Row xs={1} className={"h-75 w-100 gx-0 gx-sm-4"}>
                    <Col sm={3} xxl={2}>
                        {/* Replace this div with the correct component */}
                        <div
                            className={
                                "d-flex justify-content-center align-items-center h-100 " +
                                styles.placeholder1
                            }
                        >
                            <p>Student list placeholder</p>
                        </div>
                    </Col>
                    <Col sm={9} xxl={10} className={"d-flex justify-content-center align-items-center"}>
                        <p>select a student to start</p>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default StudentsPage;
