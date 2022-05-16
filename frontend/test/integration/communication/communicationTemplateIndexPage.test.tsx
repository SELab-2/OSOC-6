import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getBaseCommunicationTemplate, getBaseOkResponse, getBasePage } from "../TestEntityProvider";
import { makeCacheFree } from "../Provide";
import mockAxios from "jest-mock-axios";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import apiPaths from "../../../src/properties/apiPaths";
import { communicationTemplateCollectionName } from "../../../src/api/entities/CommunicationTemplateEntity";
import CommunicationTemplateIndexPage from "../../../src/pages/communicationTemplates";

jest.mock("next/router", () => require("next-router-mock"));

describe("Communication template index page", () => {
    afterEach(() => {
        mockAxios.reset();
    });

    it("should be able to render.", () => {
        const info = render(<CommunicationTemplateIndexPage />);

        expect(info.getByTestId("communication-template-list")).toBeInTheDocument();
    });

    it("should render data when answered", async () => {
        const info = render(makeCacheFree(CommunicationTemplateIndexPage));

        const template = getBaseCommunicationTemplate("1");

        console.log(getQueryUrlFromParams(apiPaths.communicationTemplates, { sort: "name " }));

        await waitFor(() => {
            mockAxios.mockResponseFor(
                getQueryUrlFromParams(apiPaths.communicationTemplates, { sort: "name " }),
                getBaseOkResponse(
                    getBasePage(apiPaths.communicationTemplates, communicationTemplateCollectionName, [
                        template,
                    ])
                )
            );
        });

        expect(await info.findByText(template.name));
    });
});
