import CreateStudentForm from "../../components/student/createStudentForm";
import NavBar from "../../components/util/navBar";

/**
 * Component allowing the creation of a new student.
 */
export default function StudentCreate() {
    return (
        <>
            <NavBar />
            <div data-testid="student-create">
                <CreateStudentForm />
            </div>
        </>
    );
}
