import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import RegistrationForm from "../components/registrationForm";
import NavBar from "../components/navBar";
import { capitalize } from "../utility/stringUtil";
import styles from "../styles/registration.module.css";
import { Col, Row } from "react-bootstrap";

const Registration: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <div>
            <Head>
                <title className="capitalize">{t("registration")}</title>
            </Head>
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
        </div>
    );
};

export default Registration;
