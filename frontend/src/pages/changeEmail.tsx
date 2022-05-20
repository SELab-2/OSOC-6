import type { NextPage } from "next";
import { ResetComponent } from "../components/util/resetComponent";
import Navbar from "../components/util/navBar";
import { saveEmailOfUser } from "../api/calls/userCalls";
import { useCurrentUser } from "../hooks/useCurrentUser";

const ChangeEmail: NextPage = () => {
    // This is safe since we are behind the route-guard
    const { user } = useCurrentUser();

    return (
        <div>
            <Navbar />
            <ResetComponent name="email" handler={saveEmailOfUser} user={user!} />
        </div>
    );
};

export default ChangeEmail;
