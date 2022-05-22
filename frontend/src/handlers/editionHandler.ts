import { Edition } from "../api/entities/EditionEntity";
import { createNewEdition, extractIdFromEditionUrl } from "../api/calls/editionCalls";
import applicationPaths from "../properties/applicationPaths";
import { RouterAction } from "../hooks/routerHooks";

// Post new edition
export async function editionSubmitHandler(values: Edition, routerAction: RouterAction) {
    const result = await createNewEdition(values);
    const id = extractIdFromEditionUrl(result._links.self.href);

    await routerAction("/" + applicationPaths.editionBase + "/" + id);
}
