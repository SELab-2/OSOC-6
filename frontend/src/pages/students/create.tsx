import CreateStudentForm from "../../components/student/createStudentForm";
import NavBar from "../../components/util/navBar";
import { Background } from "../../components/util/background";

/**
 * Page allowing the creation of a new student.
 */
export default function StudentCreate() {
    return (
        <>
            <NavBar />
            <Background />
            <CreateStudentForm />
        </>
    );
}
