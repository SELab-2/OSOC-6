import type { NextPage } from "next";
import { ResetComponent } from "../components/util/resetComponent";
import Navbar from "../components/util/navBar";
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
