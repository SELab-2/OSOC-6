import type {NextPage} from "next";
import {ResetComponent} from "../components/util/resetComponent";
import {postResetPassword} from "../api/calls/userCalls";
import {useRouter} from "next/router";
import NavBar from "../components/util/navBar";
import styles from "../styles/forgotPassword.module.css";
import {emptyUser} from "../api/entities/UserEntity";
import {capitalize} from "../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";

const ResetPassword: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const query = router.query as {token: string};
    const resetToken = query.token;

    return (
        <main>
            <NavBar />
            <div className={styles.forgot_full_div}>
                <div className="d-flex justify-content-center align-items-center flex-column">
                    <h2 className="mt-5 mb-5">{capitalize(t("reset password title"))}</h2>
                    <ResetComponent name="password" handler={postResetPassword} user={emptyUser} token={resetToken} />
                </div>
            </div>
        </main>
    );
};

export default ResetPassword;
