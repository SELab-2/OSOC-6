import { IStudent } from "../../api/entities/StudentEntity";
import { Field, Form, Formik } from "formik";
import useSWR from "swr";
import { getAllAssignmentsFormLinks } from "../../api/calls/AssignmentCalls";

export interface ConflictResolutionItemProps {
    student: IStudent;
}
export default function ConflictResolutionItem({ student }: ConflictResolutionItemProps) {
    const { data: receivedAssignments, error: assignmentsError } = useSWR(
        student._links.assignments,
        getAllAssignmentsFormLinks
    );

    if (assignmentsError) {
        console.log(assignmentsError);
        return null;
    }

    // Sort for consistency
    const assignments = (receivedAssignments || []).sort((first, second) =>
        first._links.self.href.localeCompare(second._links.self.href)
    );

    return (
        <div key={student._links.self.href}>
            <div>{student.callName}</div>
            <Formik
                initialValues={{
                    picked: "",
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    alert(JSON.stringify(values, null, 2));
                }}
            >
                {({ values }) => (
                    <Form>
                        <div id="my-radio-group">Picked</div>
                        <div role="group" aria-labelledby="my-radio-group">
                            <label>
                                <Field type="radio" name="picked" value="One" />
                                One
                            </label>
                            <label>
                                <Field type="radio" name="picked" value="Two" />
                                Two
                            </label>
                            <div>Picked: {values.picked}</div>
                        </div>

                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
