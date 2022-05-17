import { AxiosResponse } from "axios";
import { saveEditionActiveState, saveEditionName, saveEditionYear } from "../api/calls/editionCalls";

/**
 * Changes the name of an edition.
 * @param url the url hosting the edition.
 * @param name the new name of the edition.
 */
export async function editionSaveNameHandler(url: string, name: string): Promise<AxiosResponse> {
    return await saveEditionName(url, name);
}

/**
 * Changes the year of an edition.
 * @param url the url hosting the edition.
 * @param year the new year of the edition.
 */
export async function editionSaveYearHandler(url: string, year: string): Promise<AxiosResponse> {
    return await saveEditionYear(url, year);
}

/**
 * Changes the active-state of an edition.
 * @param url the url hosting the edition.
 * @param active the new state of the edition.
 */
export async function editionSaveActiveHandler(url: string, active: boolean): Promise<AxiosResponse> {
    return await saveEditionActiveState(url, active);
}
