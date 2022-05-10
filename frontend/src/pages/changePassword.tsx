import type { NextPage } from "next";
import { ResetComponent } from "../components/resetComponent";
import Navbar from "../components/navBar";
import { savePasswordOfUser } from "../api/calls/userCalls";

const ChangePassword: NextPage = () => {
    return (
        <div>
            <Navbar />
            <ResetComponent name="password" handler={savePasswordOfUser} />
        </div>
    );
};

export default ChangePassword;
