import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getBaseCommunicationTemplate, getBaseOkResponse } from "./TestEntityProvider";
import { makeCacheFree } from "./Provide";
import CommunicationInfo from "../../src/components/CommunicationInfo";
import mockAxios from "jest-mock-axios";
import CommunicationTemplateInfo from "../../src/components/CommunicationTemplateInfo";

describe("Communication template info", () => {
    const template = getBaseCommunicationTemplate("1");

    it("should be able to render.", () => {
        const info = render(<CommunicationTemplateInfo url={template._links.self.href} />);

        expect(info.getByTestId("communication-template-info")).toBeInTheDocument();
    });

    it("should render when answered", async () => {
        const info = render(
            makeCacheFree(() => CommunicationTemplateInfo({ url: template._links.self.href }))
        );

        await waitFor(() => {
            mockAxios.mockResponseFor(template._links.self.href, getBaseOkResponse(template));
        });
        expect(await info.findByText(template.template));
    });
});
