import type { NextPage } from "next";
import { ResetComponent } from "../components/util/resetComponent";
import Navbar from "../components/util/navBar";
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
