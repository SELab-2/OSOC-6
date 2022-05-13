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

/**
 * Function that makes sure the SWR cache is disabled in the provided component.
 * This is needed in tests when data changes.
 * @param Component that should be made cache free.
 */
export function makeCacheFree(Component: any) {
    return (
        <SWRConfig value={{ provider: () => new Map() }}>
            <Component />
        </SWRConfig>
    );
}

/**
 * Makes sure the provided component can use the useEdition hook.
 * @param Component the component that needs to use the useEdition hook.
 * @param edition the [IEdition] that should be returned by useEdition.
 */
export function enableUseEdition(Component: any, edition: IEdition) {
    return (
        <GlobalContext.Provider value={{ edition, setEdition: () => {} }}>
            <Component />
        </GlobalContext.Provider>
    );
}

/**
 * Function that will provide you with the url useSWR with edition will call when
 * the useEdition edition is set to edition.
 * @param url the url provided to useSWRWithEdition
 * @param edition the edition provided to enableUseEdition.
 */
export function getAxiosCallWithEdition(url: string, edition: IEdition) {
    return getQueryUrlFromParams(url, { edition: extractIdFromEditionUrl(edition._links.self.href) });
}

/**
 * Function that makes sure the useCurrentUser hook is enabled with a certain user.
 * @param user the user that should be returned by useCurrentEdition.
 */
export function enableCurrentUser(user: IUser): Promise<void> {
    return waitFor(() => {
        mockAxios.mockResponseFor({ url: apiPaths.ownUser }, getBaseOkResponse(user));
    });
}
