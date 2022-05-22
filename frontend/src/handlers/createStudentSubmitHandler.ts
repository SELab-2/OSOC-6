import { ScopedMutator } from "swr/dist/types";
import apiPaths from "../properties/apiPaths";
import applicationPaths from "../properties/applicationPaths";
import { IStudent, Student } from "../api/entities/StudentEntity";
import { createNewStudent, editStudent, extractIdFromStudentUrl } from "../api/calls/studentCalls";
import { RouterAction } from "../hooks/routerHooks";

export async function createStudentSubmitHandler(
    existingStudentUrl: string | null,
    values: Student,
    routerAction: RouterAction,
    mutate: ScopedMutator
) {
    let result: IStudent;
    if (existingStudentUrl) {
        result = await editStudent(existingStudentUrl, values);
    } else {
        result = await createNewStudent(values);
    }
    const id = extractIdFromStudentUrl(result._links.self.href);

    await Promise.all([
        mutate(apiPaths.students),
        mutate(result._links.self.href, result),
        routerAction("/" + applicationPaths.students + "/" + id),
    ]);
}
