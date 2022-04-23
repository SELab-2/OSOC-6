import axios from "axios";
import { AxiosConf, AxiosFormConfig } from "../api/calls/baseCalls";
import { UserRole } from "../api/entities/UserEntity";

export async function userDeleteHandler(url: string) {
    return await axios.delete(url, AxiosFormConfig);
}

export async function disabledUserHandler(url: string) {
    return await axios.patch(url, { enabled: false }, AxiosConf);
}

export async function setRoleCoachHandler(url: string) {
    return await axios.patch(url, { enabled: true, userRole: UserRole.coach }, AxiosConf);
}

export async function setRoleAdminHandler(url: string) {
    return await axios.patch(url, { enabled: true, userRole: UserRole.admin }, AxiosConf);
}
