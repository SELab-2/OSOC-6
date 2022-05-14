import axios, { AxiosResponse } from "axios";
import { AxiosConf } from "../api/calls/baseCalls";

// Patch the name of an edition
export async function editionSaveNameHandler(url: string, name: string): Promise<AxiosResponse> {
    return await axios.patch(url, { name: name }, AxiosConf);
}

// Patch the year of an edition
export async function editionSaveYearHandler(url: string, year: string): Promise<AxiosResponse> {
    return await axios.patch(url, { year: year }, AxiosConf);
}

// Patch the active-state of an edition
export async function editionSaveActiveHandler(url: string, active: boolean): Promise<AxiosResponse> {
    return await axios.patch(url, { active: active }, AxiosConf);
}
