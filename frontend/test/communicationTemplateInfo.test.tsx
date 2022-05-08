import "@testing-library/jest-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import CommunicationTemplateInfo from "../src/pages/communicationTemplates/[id]";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../src/properties/apiPaths";
import userEvent from "@testing-library/user-event";

jest.mock("next/router", () => require("next-router-mock"));

describe("communication template info", () => {
    const templateId = "1";
    let page: RenderResult;

    beforeEach(() => {
        mockRouter.query.id = templateId;
        page = render(<CommunicationTemplateInfo />);
    });

    it("renders component", () => {
        expect(page.getByTestId("communication-template-info")).toBeInTheDocument();
        expect(page.getByTestId("mail-to-button")).toBeInTheDocument();
    });

    it("calls correct template", async () => {
        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalledWith(
                apiPaths.communicationTemplates + "/" + templateId,
                expect.anything()
            );
        });
    });
});
