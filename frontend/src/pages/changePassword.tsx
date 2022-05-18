import type { NextPage } from "next";
import { ResetComponent } from "../components/util/resetComponent";
import Navbar from "../components/util/navBar";
import { savePasswordOfUser } from "../api/calls/userCalls";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { emptyUser } from "../api/entities/UserEntity";

const ChangePassword: NextPage = () => {
    let { user: userResponse, error } = useCurrentUser();

    const user = userResponse || emptyUser;

    if (error) {
        console.log(error);
        return null;
    }

    return (
        <div>
            <Navbar />
            <ResetComponent name="password" handler={savePasswordOfUser} user={user} token={null} />
        </div>
    );
};

export default ChangePassword;
