import axios from "axios";
import { AxiosFormConfig } from "../api/calls/baseCalls";
import apiPaths from "../properties/apiPaths";

export async function userDeleteHandler(url: string) {
    return await axios.delete(url, AxiosFormConfig);
}

export async function disabledUserHandler(url: string) {
    const config = {
        baseURL: apiPaths.base,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    };
    return await axios.patch(url, { enabled: false }, config);
}

export async function setRoleCoachHandler(url: string) {
    const config = {
        baseURL: apiPaths.base,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    };
    return await axios.patch(url, { enabled: true, userRole: "COACH" }, config);
}

export async function setRoleAdminHandler(url: string) {
    const config = {
        baseURL: apiPaths.base,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    };
    return await axios.patch(url, { enabled: true, userRole: "ADMIN" }, config);
}
