import apiPaths from "../properties/apiPaths";
import Router from "next/router";
import axios from "axios";
import { AxiosFormConfig } from "../api/calls/baseCalls";
import { ScopedMutator } from "swr/dist/types";

export interface LoginValues {
    username: string;
    password: string;
}

export type LoginProps = {
    submitHandler: (values: LoginValues) => void;
};

export async function loginSubmitHandler(values: LoginValues, mutate: ScopedMutator<any>) {
    // store the states in the form data
    const loginFormData = new FormData();
    loginFormData.append("username", values.username);
    loginFormData.append("password", values.password);

    const response = await axios.post(apiPaths.login, loginFormData, AxiosFormConfig);
    // redirect to the url specified in the response
    let redirect =
        Router.query.returnUrl != undefined ? Router.query.returnUrl : response.request.responseURL;
    await Router.push(redirect);
}
