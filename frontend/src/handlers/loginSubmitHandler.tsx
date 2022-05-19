import apiPaths from "../properties/apiPaths";
import { NextRouter } from "next/router";
import { ScopedMutator } from "swr/dist/types";
import { getUserOnUrl, postLoginFromForm } from "../api/calls/userCalls";
import applicationPaths from "../properties/applicationPaths";
import { redirect } from "next/dist/server/api-utils";
import { getAllEditionsFromPage } from "../api/calls/editionCalls";

export interface LoginValues {
    username: string;
    password: string;
}

export type LoginProps = {
    submitHandler: (values: LoginValues) => void;
};

export async function loginSubmitHandler(
    values: LoginValues,
    errorSetter: (errorOccurred: boolean) => void,
    router: NextRouter,
    mutate: ScopedMutator<any>
) {
    // store the states in the form data
    const loginFormData = new FormData();
    loginFormData.append("username", values.username);
    loginFormData.append("password", values.password);

    const response = await postLoginFromForm(loginFormData);
    const errorOccurred =
        response.request.responseURL.split(applicationPaths.base)[1] === apiPaths.loginError;

    errorSetter(errorOccurred);

    if (!errorOccurred) {
        // You are logged in.
        const [user, editions] = await Promise.all([
            getUserOnUrl(apiPaths.ownUser),
            getAllEditionsFromPage(apiPaths.editions),
        ]);
        Promise.all([mutate(apiPaths.ownUser, user), mutate(apiPaths.editions, editions)]).catch(console.log);

        const redirectUrl =
            router.query.returnUrl === undefined
                ? "/" + applicationPaths.assignStudents
                : "/" + router.query.returnUrl;

        await router.push(redirectUrl);
    }
}
