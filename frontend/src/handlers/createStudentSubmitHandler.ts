import { NextRouter } from "next/router";
import { ScopedMutator } from "swr/dist/types";
import apiPaths from "../properties/apiPaths";
import applicationPaths from "../properties/applicationPaths";
import { IStudent, Student } from "../api/entities/StudentEntity";
import { createNewStudent, editStudent, extractIdFromStudentUrl } from "../api/calls/studentCalls";

export async function createStudentSubmitHandler(
    url: string | null,
    values: Student,
    router: NextRouter,
    mutate: ScopedMutator
) {
    let result: IStudent;
    if (url) {
        result = await editStudent(url, values);
    } else {
        result = await createNewStudent(values);
    }
    const id = extractIdFromStudentUrl(result._links.self.href);

    await Promise.all([
        mutate(apiPaths.students),
        mutate(result._links.self.href, result),
        router.push("/" + applicationPaths.students + "/" + id),
    ]);
}
