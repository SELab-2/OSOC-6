import { NextPage } from "next";
import RegistrationForm from "../components/registrationForm";
import NavBar from "../components/navBar";

const Registration: NextPage = () => {
    return (
        <div>
            <NavBar />
            <RegistrationForm />
        </div>
    );
};

export default Registration;
