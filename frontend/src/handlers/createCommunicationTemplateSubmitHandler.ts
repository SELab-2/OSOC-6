// export interface CommunicationTemplateCreationValues {
//     username: string;
//     password: string;
// }
//
// export interface CommunicationTemplateCreationProps {
//     submitHandler: (values: CommunicationTemplateCreationValues) => void;
// }

import { createNewCommunicationTemplate } from "../api/calls/communicationTemplateCalls";
import { CommunicationTemplateEntity } from "../api/entities/CommunicationTemplateEntity";
import { extractIdFromApiEntityUrl } from "../api/calls/baseCalls";
import { NextRouter } from "next/router";
import applicationPaths from "../properties/applicationPaths";

export async function createCommunicationTemplateSubmitHandler(
    values: CommunicationTemplateEntity,
    router: NextRouter
) {
    console.log(values);
    const result = await createNewCommunicationTemplate(values);
    const id = extractIdFromApiEntityUrl(result._links.self.href);

    await router.push(applicationPaths.communicationTemplateBase + "/" + id);
}
