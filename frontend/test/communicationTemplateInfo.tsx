import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import CommunicationTemplateInfo from "../src/pages/communicationTemplate/[id]";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../src/properties/apiPaths";

jest.mock("next/router", () => require("next-router-mock"));

describe("communication template info", () => {
    const templateId = "1";

    beforeEach(() => {
        mockRouter.query.id = templateId;
    });

    it("renders", () => {
        render(<CommunicationTemplateInfo />);
    });

    it("calls correct template", async () => {
        render(<CommunicationTemplateInfo />);

        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalledWith(
                apiPaths.communicationTemplates + "/" + templateId,
                expect.anything()
            );
        });
    });
});
