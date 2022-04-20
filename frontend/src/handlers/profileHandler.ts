import axios, { AxiosResponse } from "axios";
import Router from "next/router";
import applicationPaths from "../properties/applicationPaths";
import apiPaths from "../properties/apiPaths";

export const AxiosFormConfig = {
    baseURL: apiPaths.base,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
};

export async function profileDeleteHandler(event: any) {
    const response = await axios.delete(event.target.value, AxiosFormConfig);
    // redirect to login
    if (response.status == 204) {
        await Router.push(applicationPaths.login);
    }
}

export async function profileSaveHandler(url: string, callname: string): Promise<AxiosResponse<any>> {
    return await axios.patch(url, { callName: callname }, AxiosFormConfig);
}
