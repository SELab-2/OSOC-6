import { NextPage } from "next";
import RegistrationForm from "../components/registrationForm";
import NavBar from "../components/navBar";
import { capitalize } from "../utility/stringUtil";
import styles from "../styles/registration.module.css";
import { Col, Row } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";

const Registration: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <main>
            <NavBar />
            <div className={styles.registration_full_div}>
                <Row className={styles.registration_row}>
                    <Col>
                        <h2 style={{ marginTop: "100px", marginLeft: "100px" }}>
                            {capitalize(t("let's get started"))}
                        </h2>
                    </Col>
                    <Col>
                        <div className={styles.registration_div}>
                            <h3>{capitalize(t("registration"))}</h3>
                            <RegistrationForm />
                        </div>
                    </Col>
                </Row>
            </div>
        </main>
    );
};

export default Registration;
