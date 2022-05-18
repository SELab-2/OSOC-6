import type { NextPage } from "next";
import { ResetComponent } from "../components/util/resetComponent";
import Navbar from "../components/util/navBar";
import { savePasswordOfUser } from "../api/calls/userCalls";
import { useCurrentUser } from "../hooks/useCurrentUser";

const ChangePassword: NextPage = () => {
    // This is safe since we are behind the route-guard
    const { user } = useCurrentUser();

    return (
        <div>
            <Navbar />
            <ResetComponent name="password" handler={savePasswordOfUser} user={user!} token={null} />
        </div>
    );
};

export default ChangePassword;
