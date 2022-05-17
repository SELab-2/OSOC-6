import { NextRouter } from "next/router";
import { Communication, ICommunication } from "../api/entities/CommunicationEntity";
import applicationPaths from "../properties/applicationPaths";
import { createNewCommunication, extractIdFromCommunicationUrl } from "../api/calls/communicationCalls";
import { ScopedMutator } from "swr/dist/types";
import apiPaths from "../properties/apiPaths";

export async function createCommunicationSubmitHandler(
    values: Communication,
    router: NextRouter,
    mutate: ScopedMutator
) {
    const communication: ICommunication = await createNewCommunication(values);
    const id = extractIdFromCommunicationUrl(communication._links.self.href);

    await Promise.all([
        mutate(apiPaths.communications),
        router.push("/" + applicationPaths.communicationBase + "/" + id),
    ]);
}
