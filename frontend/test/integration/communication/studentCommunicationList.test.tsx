import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import StudentCommunicationList from "../../../src/components/student/studentCommunicationList";
import {
    getBaseCommunication,
    getBaseCommunicationTemplate,
    getBaseOkResponse,
    getBasePage,
    getBaseStudent, getBaseTeapot,
} from "../TestEntityProvider";
import { enableActForResponse, makeCacheFree } from "../Provide";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import apiPaths from "../../../src/properties/apiPaths";
import { communicationCollectionName } from "../../../src/api/entities/CommunicationEntity";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import applicationPaths from "../../../src/properties/applicationPaths";
import {RegisterCommunication} from "../../../src/components/communication/registerCommunication";

jest.mock("next/router", () => require("next-router-mock"));

describe("communication list", () => {
    const studentId = "1";
    const student = getBaseStudent(studentId);
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders", () => {
        const page = render(<StudentCommunicationList student={student} />);
        expect(page.getByTestId("communication-list")).toBeInTheDocument();
    });

    it("Renders with data ", async () => {
        const studentId = "1";
        const student = getBaseStudent(studentId);
        const list = render(makeCacheFree(() => <StudentCommunicationList student={student} />));

        const communication = getBaseCommunication("2");
        await enableActForResponse(
            getQueryUrlFromParams(apiPaths.communicationsByStudent, { studentId, sort: "timestamp" }),
            getBaseOkResponse(
                getBasePage(apiPaths.communicationsByStudent, communicationCollectionName, [communication])
            )
        );

        const template = getBaseCommunicationTemplate("4");
        await enableActForResponse(communication._links.template.href, getBaseOkResponse(template));

        await waitFor(() => expect(list.getByText(template.name)).toBeInTheDocument());
    });

    it("button should redirect to studentinfo", async () => {
        mockRouter.asPath =
            "/" + applicationPaths.students + "/" + studentId + "/" + applicationPaths.communicationBase;
        const list = render(makeCacheFree(() => <StudentCommunicationList student={student} />));

        const communication = getBaseCommunication("2");
        await enableActForResponse(
            getQueryUrlFromParams(apiPaths.communicationsByStudent, { studentId, sort: "timestamp" }),
            getBaseOkResponse(
                getBasePage(apiPaths.communicationsByStudent, communicationCollectionName, [communication])
            )
        );

        const template = getBaseCommunicationTemplate("4");
        await enableActForResponse(communication._links.template.href, getBaseOkResponse(template));

        await waitFor(() => expect(list.getByText(template.name)).toBeInTheDocument());

        await userEvent.click(list.getByTestId("open-studentinfo"));
    });

    it("should handle error", async () => {
        console.log = jest.fn();

        render(makeCacheFree(() => <StudentCommunicationList student={student} />));
        await enableActForResponse(
            getQueryUrlFromParams(apiPaths.communicationsByStudent, { studentId, sort: "timestamp" }),
            getBaseTeapot()
        );

        await waitFor(() => expect(console.log).toHaveBeenCalled())
    });
});
