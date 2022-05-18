import type {NextPage} from "next";
import {ForgotComponent} from "../components/util/forgotComponent";
import {forgotPasswordSubmitHandler} from "../handlers/forgotPasswordSubmitHandler";
import NavBar from "../components/util/navBar";
import styles from "../styles/forgotPassword.module.css";

/**
 * The forgot password page, where a user can enter their email to request a password reset.
 */
const ForgotPassword: NextPage = () => {
    return (
        <main>
            <NavBar />
            <div className={styles.forgot_full_div}>
                <div className="d-flex justify-content-center align-items-center flex-column">
                    <h2 className="mt-5">
                        Forgot password
                    </h2>
                    <ForgotComponent submitHandler={(form) => forgotPasswordSubmitHandler(form)}/>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
