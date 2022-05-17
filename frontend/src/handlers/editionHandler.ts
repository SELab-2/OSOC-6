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
