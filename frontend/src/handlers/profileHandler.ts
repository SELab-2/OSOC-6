import axios from "axios";
import { AxiosFormConfig } from "../api/requests";
import Router from "next/router";
import apiPaths from "../properties/apiPaths";

export async function profileDeleteHandler(url: string) {
    const response = await axios.delete(url, AxiosFormConfig);
    // redirect to login
    await Router.push(apiPaths.login);
}
