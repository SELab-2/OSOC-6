import type { NextPage } from "next";
import { ResetComponent } from "../components/resetComponent";
import Navbar from "../components/navBar";
import { savePasswordHandler } from "../handlers/confirmResetHandler";

const ChangePassword: NextPage = () => {
    return (
        <div>
            <Navbar />
            <ResetComponent name="password" handler={savePasswordHandler} />
        </div>
    );
};

export default ChangePassword;
