import useTranslation from "next-translate/useTranslation";
import CreateStudentForm from "../../components/student/createStudentForm";
import NavBar from "../../components/util/navBar";
import { capitalize } from "../../utility/stringUtil";

/**
 * Component allowing the creation of a new student.
 */
export default function StudentCreate() {
    const { t } = useTranslation("common");

    return (
        <>
            <NavBar />
            <div data-testid="student-create">
                <CreateStudentForm title={capitalize(t("create student"))} />
            </div>
        </>
    );
}
