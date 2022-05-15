import apiPaths from "../properties/apiPaths";
import { NextRouter } from "next/router";
import { ScopedMutator } from "swr/dist/types";
import { postLoginFromForm } from "../api/calls/userCalls";
import applicationPaths from "../properties/applicationPaths";

export interface LoginValues {
    username: string;
    password: string;
}

export type LoginProps = {
    submitHandler: (values: LoginValues) => void;
};

export async function loginSubmitHandler(
    values: LoginValues,
    router: NextRouter,
    mutate: ScopedMutator<any>
) {
    // store the states in the form data
    const loginFormData = new FormData();
    loginFormData.append("username", values.username);
    loginFormData.append("password", values.password);
    await postLoginFromForm(loginFormData);

    // redirect to the url specified in the response
    const redirect: string =
        router.query.returnUrl?.at(0) !== undefined
            ? router.query.returnUrl[0]
            : "/" + applicationPaths.assignStudents;
    await Promise.all([mutate(apiPaths.ownUser), mutate(apiPaths.editions)]);
    await router.push(redirect);
}
