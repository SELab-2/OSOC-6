import type { NextPage } from "next";
import LoginForm from "../components/user/loginForm";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import useTranslation from "next-translate/useTranslation";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import NavBar from "../components/util/navBar";
import { Card, Col, Row } from "react-bootstrap";
import styles from "../styles/loginForm.module.css";
import { capitalize } from "../utility/stringUtil";
import { useState } from "react";
import applicationPaths from "../properties/applicationPaths";
import { Background } from "../components/util/background";

const Login: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const [hadError, setHadError] = useState<boolean>(false);

    return (
        <div className={styles.login_page}>
            <Background />
            <NavBar />
            <div className={styles.login_full_div}>
                <div className={styles.login_row}>
                    <div className={styles.login_floating_text_col}>
                        <h1 className={styles.login_floating_text}>{capitalize(t("let's get started"))}</h1>
                    </div>
                    <div className={styles.login_col}>
                        <div className={styles.login_div}>
                            <h2>{capitalize(t("signin"))}</h2>
                            <Card hidden={!hadError}>
                                <Card.Body className={styles.login_card}>
                                    <Card.Text>
                                        {capitalize(t("errorMessages:invalid_credentials"))}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <LoginForm
                                submitHandler={(form) =>
                                    loginSubmitHandler(form, setHadError, router, mutate)
                                }
                            />
                            <div className="mt-2">
                                <a href={"/" + applicationPaths.forgotPassword}>
                                    {capitalize(t("forgot password link"))}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
