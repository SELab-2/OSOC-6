import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getBaseCommunicationTemplate, getBaseOkResponse } from "../TestEntityProvider";
import { makeCacheFree } from "../Provide";
import mockAxios from "jest-mock-axios";
import CommunicationTemplatePage from "../../../src/pages/communicationTemplates/[id]";
import mockRouter from "next-router-mock";
import userEvent from "@testing-library/user-event";
import CommunicationInfoPage from "../../../src/pages/students/[id]/register-communication";
import apiPaths from "../../../src/properties/apiPaths";

jest.mock("next/router", () => require("next-router-mock"));

describe("Communication template info page", () => {
    const templateId = "1";
    const template = getBaseCommunicationTemplate(templateId);

    beforeEach(() => {
        mockRouter.query = {
            id: templateId,
        };
    });

    afterEach(() => {
        mockAxios.reset();
    });

    it("should be able to render.", () => {
        const info = render(<CommunicationTemplatePage />);

        expect(info.getByTestId("communication-template-info")).toBeInTheDocument();
    });

    it("should render when answered", async () => {
        const info = render(makeCacheFree(CommunicationTemplatePage));
        await waitFor(() => {
            mockAxios.mockResponseFor(
                template._links.self.href.split("api/")[1],
                getBaseOkResponse(template)
            );
        });
        expect(await info.findByText(template.template));
    });
});
