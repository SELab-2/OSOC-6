import type { NextPage } from "next";
import { ResetComponent } from "../components/resetComponent";
import Navbar from "../components/navBar";
import { saveEmailHandler } from "../handlers/confirmResetHandler";

const ChangeEmail: NextPage = () => {
    return (
        <div>
            <Navbar />
            <ResetComponent name="email" handler={saveEmailHandler} />
        </div>
    );
};

export default ChangeEmail;
