import { SWRConfig } from "swr";
import { IEdition } from "../../src/api/entities/EditionEntity";
import GlobalContext from "../../src/context/globalContext";
import { getQueryUrlFromParams } from "../../src/api/calls/baseCalls";
import { extractIdFromEditionUrl } from "../../src/api/calls/editionCalls";
import { waitFor } from "@testing-library/react";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../src/properties/apiPaths";
import { getBaseOkResponse } from "./TestEntityProvider";
import { IUser } from "../../src/api/entities/UserEntity";

jest.mock("next/router", () => require("next-router-mock"));

export function makeCacheFree(Component: any) {
    return (
        <SWRConfig value={{ provider: () => new Map() }}>
            <Component />
        </SWRConfig>
    );
}

export function enableUseEdition(Component: any, edition: IEdition) {
    return (
        <GlobalContext.Provider value={{ edition, setEdition: () => {} }}>
            <Component />
        </GlobalContext.Provider>
    );
}

export function getAxiosCallWithEdition(url: string, edition: IEdition) {
    return getQueryUrlFromParams(url, { edition: extractIdFromEditionUrl(edition._links.self.href) });
}

export function enableOwnUser(user: IUser): Promise<void> {
    return waitFor(() => {
        mockAxios.mockResponseFor({ url: apiPaths.ownUser }, getBaseOkResponse(user));
    });
}
