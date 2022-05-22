import "@testing-library/jest-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import SkillTypeIndexPage from "../../../src/pages/skillTypes";
import { enableActForResponse, makeCacheFree } from "../Provide";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import { getBaseOkResponse, getBasePage, getBaseSkillType } from "../TestEntityProvider";
import { skillTypeCollectionName } from "../../../src/api/entities/SkillTypeEntity";
import mockRouter from "next-router-mock";
import applicationPaths from "../../../src/properties/applicationPaths";

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

        it("create skill type button works", async () => {
            const page = render(<SkillTypeIndexPage />);

            const addButton = page.getByTestId("new-skill-type-button");
            await userEvent.click(addButton);

            await expect(mockRouter.asPath).toEqual("/" + applicationPaths.skillTypesCreate);
        });
    });

    describe("with data", () => {
        let page: RenderResult;
        const skillType = getBaseSkillType("1");
        const otherSkillType = getBaseSkillType("2");
        otherSkillType.name = "different";

        beforeEach(async () => {
            page = render(makeCacheFree(SkillTypeIndexPage));

            await enableActForResponse(
                getQueryUrlFromParams(apiPaths.skillTypes, { sort: "name" }),
                getBaseOkResponse(
                    getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [skillType, otherSkillType])
                )
            );
        });

        it("renders the name", async () => {
            expect(await page.findByText(skillType.name));
        });

        it("can delete", async () => {
            const deleteButtons = await page.findAllByTestId("delete-item");

            window.confirm = jest.fn(() => true);

            await userEvent.click(deleteButtons[0]);

            expect(mockAxios.delete).toHaveBeenCalledWith(skillType._links.self.href, expect.anything());
        });

        it("can edit", async () => {
            const openEditButtons = await page.findAllByTestId("start-edit");
            await userEvent.click(openEditButtons[0]);

            const colourPick = (await page.findByTestId("colour")) as HTMLInputElement;
            // Just check if it takes the default colour. Setting it in the test is a pain.
            const colour: string = colourPick.value;

            const submitButton = await page.findByTestId("submit-edit");
            await userEvent.click(submitButton);

            await enableActForResponse(skillType._links.self.href, getBaseOkResponse(skillType));

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
