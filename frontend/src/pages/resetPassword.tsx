import type { NextPage } from "next";
import { ResetComponent } from "../components/util/resetComponent";
import { postResetPassword } from "../api/calls/userCalls";
import { useRouter } from "next/router";
import NavBar from "../components/util/navBar";
import styles from "../styles/forgotPassword.module.css";
import { emptyUser } from "../api/entities/UserEntity";
import { capitalize } from "../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import { Background } from "../components/util/background";

/**
 * The reset password page, where a user enters their new password.
 */
const ResetPassword: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const query = router.query as { token: string };
    const resetToken = query.token;

    return (
        <div>
            <Background />
            <NavBar />
            <ResetComponent name="password" handler={postResetPassword} user={emptyUser} token={resetToken} />
        </div>
    );
};

export default ResetPassword;
