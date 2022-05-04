import type { NextPage } from "next";
import Head from "next/head";
import LoginForm from "../components/loginForm";
import { Card, Col, Row } from "react-bootstrap";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../utility/stringUtil";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import styles from "../styles/loginForm.module.css";
import NavBar from "../components/navBar";

const LoginError: NextPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { mutate } = useSWRConfig();
    return (
        <div>
            <Head>
                <title className="capitalize">{t("login page title")}</title>
            </Head>
            <main>
                <NavBar />
                <div className={styles.login_full_div}>
                    <Row className={styles.login_row}>
                        <Col>
                            <h2 style={{ marginTop: "100px", marginLeft: "100px" }}>
                                {capitalize(t("let's get started"))}
                            </h2>
                        </Col>
                        <Col>
                            <div className={styles.login_div}>
                                <h3>{capitalize(t("signin"))}</h3>
                                <Card>
                                    <Card.Body className={styles.login_card}>
                                        <Card.Text>
                                            {capitalize(t("errorMessages:invalid_credentials"))}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <LoginForm
                                    submitHandler={(form) => loginSubmitHandler(form, router, mutate)}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </main>
        </div>
    );
};

export default LoginError;
