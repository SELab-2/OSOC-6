import "@testing-library/jest-dom";
import { act, render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import CreateCommunicationForm from "../../../src/components/communication/createCommunicationForm";
import { IStudent } from "../../../src/api/entities/StudentEntity";
import {
    getBaseCommunicationTemplate,
    getBaseOkResponse,
    getBasePage,
    getBaseStudent,
    getBaseUser,
} from "../TestEntityProvider";
import { Communication } from "../../../src/api/entities/CommunicationEntity";
import { UserRole } from "../../../src/api/entities/UserEntity";
import { enableCurrentUser, makeCacheFree } from "../Provide";
import { communicationTemplateCollectionName } from "../../../src/api/entities/CommunicationTemplateEntity";
import { StudentFilterComponent } from "../../../src/components/student/studentFilterComponent";
import applicationPaths from "../../../src/properties/applicationPaths";

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
            expect(rolesElement.value).toEqual("");
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

        it("is empty instead for the queried field", async () => {
            const coachElement = (await page.findByTestId("coachCheck")) as HTMLInputElement;
            const alumniElement = (await page.findByTestId("alumniCheck")) as HTMLInputElement;
            const unmatchedElement = (await page.findByTestId("unmatchedCheck")) as HTMLInputElement;
            const freeTextElement = (await page.findByTestId("freeText")) as HTMLInputElement;
            const rolesElement = (await page.findByTestId("roles")) as HTMLInputElement;

            expect(coachElement.checked).toBeFalsy();
            expect(alumniElement.checked).toBeFalsy();
            expect(unmatchedElement.checked).toBeFalsy();

            expect(freeTextElement.value).toEqual(freeText);
            expect(rolesElement.value).toEqual("");
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

        it("is empty instead for the queried field", async () => {
            const coachElement = (await page.findByTestId("coachCheck")) as HTMLInputElement;
            const alumniElement = (await page.findByTestId("alumniCheck")) as HTMLInputElement;
            const unmatchedElement = (await page.findByTestId("unmatchedCheck")) as HTMLInputElement;
            const freeTextElement = (await page.findByTestId("freeText")) as HTMLInputElement;
            const rolesElement = (await page.findByTestId("roles")) as HTMLInputElement;

            expect(coachElement.checked).toBeFalsy();
            expect(alumniElement.checked).toBeFalsy();
            expect(unmatchedElement.checked).toBeTruthy();

            expect(freeTextElement.value).toEqual("");
            expect(rolesElement.value).toEqual("");
        });

        it("can clear search", async () => {
            const unmatchedElement = await page.findByTestId("unmatchedCheck");
            const submitElement = await page.findByTestId("submit");

            await userEvent.click(unmatchedElement);
            await userEvent.click(submitElement);

            expect(mockRouter.query?.unmatched).toEqual("false");
        });
    });
});
