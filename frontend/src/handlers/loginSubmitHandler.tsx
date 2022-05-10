import apiPaths from "../properties/apiPaths";
import { NextRouter } from "next/router";
import axios from "axios";
import { AxiosFormConfig } from "../api/calls/baseCalls";
import { ScopedMutator } from "swr/dist/types";
import { postLoginFromForm } from "../api/calls/userCalls";

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

    const response = await postLoginFromForm(loginFormData);
    // redirect to the url specified in the response
    let redirect =
        router.query.returnUrl != undefined ? router.query.returnUrl : response.request.responseURL;
    await Promise.all([mutate(apiPaths.ownUser), mutate(apiPaths.editions)]);
    await router.push(redirect);
}
