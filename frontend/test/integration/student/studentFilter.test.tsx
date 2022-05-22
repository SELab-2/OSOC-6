import "@testing-library/jest-dom";
import { act, render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { StudentFilterComponent } from "../../../src/components/student/studentFilterComponent";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import { getBaseOkResponse, getBasePage, getBaseSkillType } from "../TestEntityProvider";
import { skillTypeCollectionName } from "../../../src/api/entities/SkillTypeEntity";
import { AxiosResponse } from "axios";
import { enableActForResponse, makeCacheFree } from "../Provide";

jest.mock("next/router", () => require("next-router-mock"));

describe("student filter", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("with empty url params", () => {
        let page: RenderResult;

        beforeEach(() => {
            mockRouter.query = {};
            page = render(<StudentFilterComponent />);
        });

        it("renders", () => {
            expect(page.getByTestId("student-filter")).toBeInTheDocument();
        });

        it("only has empty fields", async () => {
            const coachElement = (await page.findByTestId("coachCheck")) as HTMLInputElement;
            const alumniElement = (await page.findByTestId("alumniCheck")) as HTMLInputElement;
            const unmatchedElement = (await page.findByTestId("unmatchedCheck")) as HTMLInputElement;
            const freeTextElement = (await page.findByTestId("freeText")) as HTMLInputElement;
            const rolesElement = (await page.findByTestId("roles")) as HTMLInputElement;

            expect(coachElement.checked).toBeFalsy();
            expect(alumniElement.checked).toBeFalsy();
            expect(unmatchedElement.checked).toBeFalsy();

            expect(freeTextElement.value).toEqual("");
            expect(rolesElement).toBeEmpty();
        });

        it("toggles checkbox", async () => {
            const unmatchedElement = await page.findByTestId("unmatchedCheck");
            const submitElement = await page.findByTestId("submit");

            await userEvent.click(unmatchedElement);
            await userEvent.click(submitElement);

            expect(mockRouter.query?.unmatched).toEqual("true");
        });

        it("queries text box", async () => {
            const freeTextElement = await page.findByTestId("freeText");
            const submitElement = await page.findByTestId("submit");

            const freeText = "Pears better than apples";
            await userEvent.type(freeTextElement, freeText);
            await userEvent.click(submitElement);

            expect(mockRouter.query?.freeText).toEqual(freeText);
        });
    });

    describe("with active free text search", () => {
        let page: RenderResult;
        const freeText = "Pears better than apples";

        beforeEach(() => {
            mockRouter.query = { freeText };
            page = render(<StudentFilterComponent />);
        });

        it("renders", () => {
            expect(page.getByTestId("student-filter")).toBeInTheDocument();
        });

        it("is empty except for the queried field", async () => {
            const coachElement = (await page.findByTestId("coachCheck")) as HTMLInputElement;
            const alumniElement = (await page.findByTestId("alumniCheck")) as HTMLInputElement;
            const unmatchedElement = (await page.findByTestId("unmatchedCheck")) as HTMLInputElement;
            const freeTextElement = (await page.findByTestId("freeText")) as HTMLInputElement;
            const rolesElement = (await page.findByTestId("roles")) as HTMLInputElement;

            expect(coachElement.checked).toBeFalsy();
            expect(alumniElement.checked).toBeFalsy();
            expect(unmatchedElement.checked).toBeFalsy();

            expect(freeTextElement.value).toEqual(freeText);
            expect(rolesElement).toBeEmpty();
        });

        it("can clear search", async () => {
            const freeTextElement = await page.findByTestId("freeText");
            const submitElement = await page.findByTestId("submit");

            await userEvent.clear(freeTextElement);
            await userEvent.click(submitElement);

            expect(mockRouter.query?.freeText).toEqual("");
        });
    });

    describe("with active toggle", () => {
        let page: RenderResult;

        beforeEach(() => {
            mockRouter.query = { unmatched: "true" };
            page = render(<StudentFilterComponent />);
        });

        it("renders", () => {
            expect(page.getByTestId("student-filter")).toBeInTheDocument();
        });

        it("is empty except for the queried field", async () => {
            const coachElement = (await page.findByTestId("coachCheck")) as HTMLInputElement;
            const alumniElement = (await page.findByTestId("alumniCheck")) as HTMLInputElement;
            const unmatchedElement = (await page.findByTestId("unmatchedCheck")) as HTMLInputElement;
            const freeTextElement = (await page.findByTestId("freeText")) as HTMLInputElement;
            const rolesElement = (await page.findByTestId("roles")) as HTMLInputElement;

            expect(coachElement.checked).toBeFalsy();
            expect(alumniElement.checked).toBeFalsy();
            expect(unmatchedElement.checked).toBeTruthy();

            expect(freeTextElement.value).toEqual("");
            expect(rolesElement).toBeEmpty();
        });

        it("can clear search", async () => {
            const unmatchedElement = await page.findByTestId("unmatchedCheck");
            const submitElement = await page.findByTestId("submit");

            await userEvent.click(unmatchedElement);
            await userEvent.click(submitElement);

            expect(mockRouter.query?.unmatched).toEqual("false");
        });
    });

    it("with role filter", async () => {
        const skillType = getBaseSkillType("5");
        const skillTypeResponse: AxiosResponse = getBaseOkResponse(
            getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [skillType])
        );
        render(makeCacheFree(StudentFilterComponent));
        await enableActForResponse(apiPaths.skillTypes, skillTypeResponse);

        const filterDropdown = await screen.findByTestId("skill-dropdown");
        const submitElement = await screen.findByTestId("submit");

        await userEvent.click(filterDropdown);
        const skill = await screen.findByTestId("select-option-" + skillType.name);
        await userEvent.click(skill);

        await userEvent.click(submitElement);

        await waitFor(() => {
            expect(mockRouter.query?.skills).toEqual([skillType.name]);
        });
    });
});
