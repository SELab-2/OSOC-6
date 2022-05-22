import type { NextPage } from "next";
import { ForgotComponent } from "../components/util/forgotComponent";
import NavBar from "../components/util/navBar";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../utility/stringUtil";
import { postForgotPasswordEmail } from "../api/calls/userCalls";
import { Background } from "../components/util/background";
import styles from "../styles/resetComponent.module.css";
import applicationPaths from "../properties/applicationPaths";

/**
 * The forgot password page, where a user can enter their email to request a password reset.
 */
const ForgotPassword: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <div>
            <Background />
            <NavBar />
            <div className={styles.reset_component}>
                <div className={styles.reset_box}>
                    <h2>{capitalize(t("forgot password title"))}</h2>
                    <ForgotComponent handler={(email: string) => postForgotPasswordEmail(email)} />
                    <div className="mt-3">
                        <a href={"/" + applicationPaths.login} className={styles.link}>
                            {capitalize(t("back to login"))}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
