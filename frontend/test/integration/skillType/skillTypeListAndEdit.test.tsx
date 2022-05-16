import "@testing-library/jest-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import CommunicationTemplateCreate from "../../../src/pages/communicationTemplates/create";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { CommunicationTemplateEntity } from "../../../src/api/entities/CommunicationTemplateEntity";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import SkillTypeIndexPage from "../../../src/pages/skillTypes";
import { makeCacheFree } from "../Provide";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import { getBaseOkResponse, getBasePage, getBaseSkillType } from "../TestEntityProvider";
import { skillTypeCollectionName } from "../../../src/api/entities/SkillTypeEntity";

jest.mock("next/router", () => require("next-router-mock"));

describe("skillType list", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("without data", () => {
        it("renders", () => {
            const page = render(<SkillTypeIndexPage />);
            expect(page.getByTestId("skill-type-list")).toBeInTheDocument();
        });
    });

    describe("with data", () => {
        let page: RenderResult;
        const skillType = getBaseSkillType("1");

        beforeEach(async () => {
            page = render(makeCacheFree(SkillTypeIndexPage));

            await waitFor(() => {
                mockAxios.mockResponseFor(
                    getQueryUrlFromParams(apiPaths.skillTypes, { sort: "name" }),
                    getBaseOkResponse(getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [skillType]))
                );
            });
        });

        it("renders the name", async () => {
            expect(await page.findByText(skillType.name));
        });

        it("can delete", async () => {
            const deleteButton = await page.findByTestId("delete");

            await userEvent.click(deleteButton);

            expect(mockAxios.delete).toHaveBeenCalledWith(skillType._links.self.href, expect.anything());
        });

        it("can edit", async () => {
            const openEditButton = await page.findByTestId("start-edit");
            userEvent.click(openEditButton);

            const colourPick = await page.findByTestId("colour");
            // Just check if it takes the default colour. Setting it in the test is a pain.
            // @ts-ignore
            const colour: string = colourPick._wrapperState.initialValue;

            const submitButton = await page.findByTestId("submit-edit");
            userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockAxios.patch).toHaveBeenCalledWith(
                    skillType._links.self.href,
                    { colour },
                    expect.anything()
                );
            });
        });
    });
});
