import axios, { AxiosResponse } from "axios";
import { AxiosConf } from "../api/calls/baseCalls";

/*
export async function editionSaveHandler(url: string, name: string | undefined = undefined, year: number | undefined = undefined, active: boolean | undefined = undefined): Promise<AxiosResponse> {
    const data = {}
    if (!name) {
        data.name = name
    }
    return await axios.patch(url, { name: name }, AxiosConf);
}
*/

export async function editionSaveNameHandler(url: string, name: string): Promise<AxiosResponse> {
    return await axios.patch(url, { name: name }, AxiosConf);
}

export async function editionSaveYearHandler(url: string, year: string): Promise<AxiosResponse> {
    return await axios.patch(url, { year: parseInt(year) }, AxiosConf);
}

export async function editionSaveActiveHandler(url: string, active: boolean): Promise<AxiosResponse> {
    return await axios.patch(url, { active: active }, AxiosConf);
}
