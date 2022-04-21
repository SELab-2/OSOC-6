import axios, { AxiosResponse } from "axios";
import { AxiosConf, AxiosFormConfig } from '../api/calls/baseCalls';

export async function userDeleteHandler(url: string) {
    return await axios.delete(url, AxiosFormConfig);
}

export async function profileSaveHandler(url: string, callname: string): Promise<AxiosResponse> {
    return await axios.patch(url, { callName: callname }, AxiosConf);
}
