import "@testing-library/jest-dom";
import { makeCacheFree } from "../Provide";
import {
    getBaseCommunication,
    getBaseCommunicationTemplate,
    getBaseOkResponse,
    getBaseStudent,
} from "../TestEntityProvider";
import { render, waitFor } from "@testing-library/react";
import mockAxios from "jest-mock-axios";
import CommunicationInfo from "../../../src/components/communication/communicationInfo";

describe("Communication info", () => {
    const communication = getBaseCommunication("1");

    it("should be able to render.", () => {
        const info = render(makeCacheFree(() => CommunicationInfo({ url: communication._links.self.href })));

        expect(info.getByTestId("communication-info")).toBeInTheDocument();
    });

    it("should render when answered", async () => {
        const info = render(makeCacheFree(() => CommunicationInfo({ url: communication._links.self.href })));

        const student = getBaseStudent("2");
        const template = getBaseCommunicationTemplate("3");

        await waitFor(() => {
            mockAxios.mockResponseFor(communication._links.self.href, getBaseOkResponse(communication));
        });
        await waitFor(() => {
            mockAxios.mockResponseFor(communication._links.student.href, getBaseOkResponse(student));
        });
        await waitFor(() => {
            mockAxios.mockResponseFor(communication._links.template.href, getBaseOkResponse(template));
        });

        expect(await info.findByText(student.callName + ": " + template.name)).toBeInTheDocument();
    });
});
