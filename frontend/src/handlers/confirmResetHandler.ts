import axios, { AxiosResponse } from "axios";
import { AxiosConf, AxiosFormConfig } from "../api/calls/baseCalls";

export async function saveEmailHandler(url: string, email: string): Promise<AxiosResponse> {
    return await axios.patch(url, { email: email }, AxiosConf);
}

export async function savePasswordHandler(url: string, password: string): Promise<AxiosResponse> {
    return await axios.patch(url, { password: password }, AxiosConf);
}
