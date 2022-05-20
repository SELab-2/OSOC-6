import type { NextPage } from "next";
import LoginForm from "../components/user/loginForm";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import useTranslation from "next-translate/useTranslation";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import NavBar from "../components/util/navBar";
import { Card } from "react-bootstrap";
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
                                <a href={"/" + applicationPaths.forgotPassword} className={styles.link}>
                                    {capitalize(t("forgot password link"))} {""}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-box-arrow-up-right"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                                        />
                                    </svg>
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
