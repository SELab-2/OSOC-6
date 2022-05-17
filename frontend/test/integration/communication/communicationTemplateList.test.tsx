import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getBaseCommunicationTemplate } from "../TestEntityProvider";
import CommunicationTemplatesList from "../../../src/components/communication/communicationTemplateList";

describe("Communication template list", () => {
    it("should be able to render.", () => {
        const template = getBaseCommunicationTemplate("1");

        const info = render(<CommunicationTemplatesList templates={[template]} />);

        expect(info.getByTestId("communication-template-list")).toBeInTheDocument();
        expect(info.getByText(template.name)).toBeInTheDocument();
    });
});
