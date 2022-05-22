import { NextRouter } from "next/router";
import { Communication, ICommunication } from "../api/entities/CommunicationEntity";
import applicationPaths from "../properties/applicationPaths";
import { createNewCommunication, extractIdFromCommunicationUrl } from "../api/calls/communicationCalls";
import { ScopedMutator } from "swr/dist/types";
import apiPaths from "../properties/apiPaths";
import { RouterAction } from "../hooks/routerHooks";

export async function createCommunicationSubmitHandler(
    values: Communication,
    routerAction: RouterAction,
    mutate: ScopedMutator
) {
    const communication: ICommunication = await createNewCommunication(values);
    const id = extractIdFromCommunicationUrl(communication._links.self.href);

    await Promise.all([
        mutate(apiPaths.communications),
        routerAction("/" + applicationPaths.communicationBase + "/" + id),
    ]);
}
