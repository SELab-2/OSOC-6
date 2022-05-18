import type { NextPage } from "next";
import { ResetComponent } from "../components/util/resetComponent";
import Navbar from "../components/util/navBar";
import { saveEmailOfUser } from "../api/calls/userCalls";
import { emptyUser } from "../api/entities/UserEntity";
import { useCurrentUser } from "../hooks/useCurrentUser";

const ChangeEmail: NextPage = () => {
    let { user: userResponse, error } = useCurrentUser();

    const user = userResponse || emptyUser;

    if (error) {
        console.log(error);
        return null;
    }

    return (
        <div>
            <Navbar />
            <ResetComponent name="email" handler={saveEmailOfUser} user={user} token={null} />
        </div>
    );
};

export default ChangeEmail;
