import { getFormPost } from '../api/requests';
import pathNames from '../properties/pathNames.json';
import Router from 'next/router';

export interface LoginValues {
    username: string;
    password: string;
}

export type LoginProps = {
    submitHandler: (values: LoginValues) => void;
};

export async function loginSubmitHandler(values: LoginValues) {
    // store the states in the form data
    const loginFormData = new FormData();
    loginFormData.append('username', values.username);
    loginFormData.append('password', values.password);

    const response = await getFormPost(pathNames.login, loginFormData);
    // redirect to the url specified in the response
    await Router.push(response.request.responseURL);
}
