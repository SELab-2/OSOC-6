import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import { ProjectInfo } from "../src/components/projectInfo";
import mockAxios from "jest-mock-axios";
import apiPaths from "../src/properties/apiPaths";
import mockRouter from "next-router-mock";
import {
    getBaseAdmin,
    getBaseLinks,
    getBaseOkResponse,
    getBaseProject,
    getBaseProjectSkill,
} from "./TestEntityProvider";
import { userCollectionName } from "../src/api/entities/UserEntity";
import { projectSkillCollectionName } from "../src/api/entities/ProjectSkillEntity";

jest.mock("next/router", () => require("next-router-mock"));

describe("project info", () => {
    it("should render without data", () => {
        render(makeCacheFree(ProjectInfo));
    });

    it.skip("should render with data", () => {
        mockRouter.setCurrentUrl("/projects/5");
        render(makeCacheFree(ProjectInfo));
        const project = getBaseProject("5");
        mockAxios.mockResponseFor({ url: apiPaths.projects + "/5" }, getBaseOkResponse(project));

        const user = getBaseAdmin("6");
        mockAxios.mockResponseFor(
            { url: project._links.coaches.href },
            getBaseOkResponse(getBaseLinks(project._links.coaches.href, userCollectionName, [user]))
        );

        const projectSkill = getBaseProjectSkill("7");
        mockAxios.mockResponseFor(
            { url: project._links.neededSkills.href },
            getBaseOkResponse(
                getBaseLinks(project._links.neededSkills.href, projectSkillCollectionName, [projectSkill])
            )
        );

        const skillType = getBaseProjectSkill("8");
        mockAxios.mockResponseFor(
            { url: apiPaths.skillTypes },
            getBaseOkResponse(
                getBaseLinks(project._links.neededSkills.href, projectSkillCollectionName, [projectSkill])
            )
        );
    });
});
