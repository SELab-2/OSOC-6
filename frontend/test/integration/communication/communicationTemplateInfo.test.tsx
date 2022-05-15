import { getBaseCommunicationTemplate } from "../TestEntityProvider";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommunicationTemplateInfo from "../../../src/components/communication/CommunicationTemplateInfo";

describe("Communication template info", () => {
    const template = getBaseCommunicationTemplate("1");

    it("should be able to render.", async () => {
        const info = render(<CommunicationTemplateInfo template={template} />);

        expect(info.getByTestId("communication-template-info")).toBeInTheDocument();
        expect(await info.findByText(template.template));
    });
});
