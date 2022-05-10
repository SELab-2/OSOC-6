import type { NextPage } from "next";
import { ResetComponent } from "../components/resetComponent";
import Navbar from "../components/navBar";
import { saveEmailOfUser } from "../api/calls/userCalls";

const ChangeEmail: NextPage = () => {
    return (
        <div>
            <Navbar />
            <ResetComponent name="email" handler={saveEmailOfUser} />
        </div>
    );
};

export default ChangeEmail;
