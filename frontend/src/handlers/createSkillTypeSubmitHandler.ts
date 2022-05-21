import { NextRouter } from "next/router";
import { ScopedMutator } from "swr/dist/types";
import { ISkillType, SkillType } from "../api/entities/SkillTypeEntity";
import { createSkillType, extractIdFromSkillTypeUrl } from "../api/calls/skillTypeCalls";
import apiPaths from "../properties/apiPaths";
import applicationPaths from "../properties/applicationPaths";
import { RouterAction } from "../hooks/routerHooks";

export async function createSkillTypeSubmitHandler(
    values: SkillType,
    routerAction: RouterAction,
    mutate: ScopedMutator
) {
    const createdSkillType: ISkillType = await createSkillType(values);

    const createdId = extractIdFromSkillTypeUrl(createdSkillType._links.self.href);
    await Promise.all([
        mutate(apiPaths.skillTypes),
        mutate(apiPaths.skillTypes + "/" + createdId, createSkillType),
        routerAction("/" + applicationPaths.skillTypesBase + "/" + createdId),
    ]);
}
