import type { NextPage } from "next";
import { ForgotComponent } from "../components/util/forgotComponent";
import NavBar from "../components/util/navBar";
import styles from "../styles/forgotPassword.module.css";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../utility/stringUtil";
import { postForgotPasswordEmail } from "../api/calls/userCalls";

/**
 * The forgot password page, where a user can enter their email to request a password reset.
 */
const ForgotPassword: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <main>
            <NavBar />
            <div className={styles.forgot_full_div}>
                <div className="d-flex justify-content-center align-items-center flex-column">
                    <h2 className="mt-5">{capitalize(t("forgot password title"))}</h2>
                    <ForgotComponent handler={(email: string) => postForgotPasswordEmail(email)} />
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
