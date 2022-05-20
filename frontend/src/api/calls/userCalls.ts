import {
    AxiosConf,
    AxiosFormConfig,
    basePatch,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromLinksUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
    getQueryUrlFromParams,
} from './baseCalls';
import { IUser, userCollectionName, UserRole } from '../entities/UserEntity';
import axios, { AxiosResponse } from 'axios';
import apiPaths from '../../properties/apiPaths';

/**
 * Fetches all users on a given UserPageUrl
 */
export function getAllUsersFromPage(url: string): Promise<IUser[]> {
    return <Promise<IUser[]>>getAllEntitiesFromPage(url, userCollectionName);
}

/**
 * Fetches all users on a given UserLinksUrl
 */
export function getAllUsersFromLinks(url: string): Promise<IUser[]> {
    return <Promise<IUser[]>>getAllEntitiesFromLinksUrl(url, userCollectionName);
}

/**
 * Get user on url
 * @param url
 */
export function getUserOnUrl(url: string): Promise<IUser> {
    return <Promise<IUser>>getEntityOnUrl(url);
}

export async function logoutUser() {
    await axios.get(apiPaths.logout, AxiosConf);
}

export function extractIdFromUserUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}

export function saveEmailOfUser(url: string, email: string): Promise<AxiosResponse> {
    return basePatch(url, { email });
}

export function savePasswordOfUser(url: string, password: string): Promise<AxiosResponse> {
    return basePatch(url, { password });
}

export function saveCallNameOfUser(url: string, callName: string): Promise<AxiosResponse> {
    return basePatch(url, { callName });
}

export function setRoleCoachOfUser(url: string): Promise<AxiosResponse> {
    return basePatch(url, { enabled: true, userRole: UserRole.coach });
}

export function setRoleAdminOfUser(url: string): Promise<AxiosResponse> {
    return basePatch(url, { enabled: true, userRole: UserRole.admin });
}

export function disabledUser(url: string): Promise<AxiosResponse> {
    return basePatch(url, { enabled: false });
}

export async function postLoginFromForm(form: FormData): Promise<AxiosResponse> {
    return axios.post(apiPaths.login, form, AxiosFormConfig);
}

/**
 * Post the provided email to the forgot password api endpoint.
 * @param email email to send the reset password link to
 */
export async function postForgotPasswordEmail(email: string): Promise<AxiosResponse> {
    return basePost(apiPaths.forgotPassword, email);
}

/**
 * Post the provided password to the reset password api endpoint with the provided token as query parameter.
 * @param token the token of the reset password request
 * @param password the new password
 */
export async function postResetPassword(token: string, password: string): Promise<AxiosResponse> {
    return basePost(getQueryUrlFromParams(apiPaths.resetPassword, { token: token }), password);
}

export function userDelete(url: string) {
    return axios.delete(url, AxiosConf);
}
