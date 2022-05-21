import {getBaseCommunicationTemplate, getBaseStudent} from "../TestEntityProvider";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommunicationTemplateInfo from "../../../src/components/communication/communicationTemplateInfo";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";

describe("Communication template info", () => {
    const template = getBaseCommunicationTemplate("1");
    const student = getBaseStudent("1");

    it("should be able to render.", async () => {
        const info = render(<CommunicationTemplateInfo template={template} />);

        expect(info.getByTestId("communication-template-info")).toBeInTheDocument();
        expect(await info.findByText(template.template));
    });

    it("should create a new template.", async () => {
        const info = render(<CommunicationTemplateInfo template={template} />);

        expect(info.getByTestId("communication-template-info")).toBeInTheDocument();
        expect(await info.findByText(template.template));
    });

    it("should render with student", async () => {
        const info = render(<CommunicationTemplateInfo template={template} student={student} />);

        expect(info.getByTestId("communication-template-info")).toBeInTheDocument();
        expect(await info.findByText(template.template));
        expect(await info.findByText("For: " + student.email));
    })
});

