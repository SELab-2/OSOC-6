import axios from "axios";
import { AxiosConf, AxiosFormConfig } from '../api/calls/baseCalls';

export async function userDeleteHandler(url: string) {
    return await axios.delete(url, AxiosFormConfig);
}

export async function disabledUserHandler(url: string) {
    return await axios.patch(url, { enabled: false }, AxiosConf);
}

export async function setRoleCoachHandler(url: string) {
    return await axios.patch(url, { enabled: true, userRole: "COACH" }, AxiosConf);
}

export async function setRoleAdminHandler(url: string) {
    return await axios.patch(url, { enabled: true, userRole: "ADMIN" }, AxiosConf);
}
