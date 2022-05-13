import type { NextPage } from "next";
import LoginForm from "../components/loginForm";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import useTranslation from "next-translate/useTranslation";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import NavBar from "../components/navBar";
import { Col, Row } from "react-bootstrap";
import styles from "../styles/loginForm.module.css";
import { capitalize } from "../utility/stringUtil";

const Login: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { mutate } = useSWRConfig();
    return (
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
                            <LoginForm submitHandler={(form) => loginSubmitHandler(form, router, mutate)} />
                        </div>
                    </Col>
                </Row>
            </div>
        </main>
    );
};

export default Login;
