import axios, { AxiosResponse } from "axios";
import { AxiosConf } from "../api/calls/baseCalls";
import { Edition } from "../api/entities/EditionEntity";
import { createNewEdition, extractIdFromEditionUrl } from "../api/calls/editionCalls";
import { NextRouter } from "next/router";
import applicationPaths from "../properties/applicationPaths";

// Post new edition
export async function editionSubmitHandler(values: Edition, router: NextRouter) {
    const result = await createNewEdition(values);
    const id = extractIdFromEditionUrl(result._links.self.href);

    await router.push("/" + applicationPaths.editionBase + "/" + id);
}

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
