import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import StudentCommunicationList from "../../../src/components/student/studentCommunicationList";
import {
    getBaseCommunication,
    getBaseCommunicationTemplate,
    getBaseOkResponse,
    getBasePage,
    getBaseStudent,
} from "../TestEntityProvider";
import { makeCacheFree } from "../Provide";
import mockAxios from "jest-mock-axios";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import apiPaths from "../../../src/properties/apiPaths";
import { communicationCollectionName } from "../../../src/api/entities/CommunicationEntity";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import applicationPaths from "../../../src/properties/applicationPaths";
import {useEditionApplicationPathTransformer} from "../../../src/hooks/utilHooks";

jest.mock("next/router", () => require("next-router-mock"));

describe("communication list", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders", () => {
        const page = render(<StudentCommunicationList studentUrl={undefined} />);
        expect(page.getByTestId("communication-list")).toBeInTheDocument();
    });

    it("Renders with data ", async () => {
        const studentId = "1";
        const student = getBaseStudent(studentId);
        const list = render(
            makeCacheFree(() => <StudentCommunicationList studentUrl={student._links.self.href} />)
        );
        await waitFor(() => {
            mockAxios.mockResponseFor(student._links.self.href, getBaseOkResponse(student));
        });

        const communication = getBaseCommunication("2");
        await waitFor(() => {
            mockAxios.mockResponseFor(
                getQueryUrlFromParams(apiPaths.communicationsByStudent, { studentId, sort: "timestamp" }),
                getBaseOkResponse(
                    getBasePage(apiPaths.communicationsByStudent, communicationCollectionName, [
                        communication,
                    ])
                )
            );
        });

        const template = getBaseCommunicationTemplate("4");
        await waitFor(() => {
            mockAxios.mockResponseFor(communication._links.template.href, getBaseOkResponse(template));
        });

        await waitFor(() => expect(list.getByText(template.name)).toBeInTheDocument());
    });

    it ("button should redirect to studentinfo", async () => {
        const studentId = "1";
        mockRouter.asPath = "/" + applicationPaths.students + "/" + studentId + "/" + applicationPaths.communicationBase;
        const student = getBaseStudent(studentId);
        const list = render(
            makeCacheFree(() => <StudentCommunicationList studentUrl={student._links.self.href} />)
        );
        await waitFor(() => {
            mockAxios.mockResponseFor(student._links.self.href, getBaseOkResponse(student));
        });

        const communication = getBaseCommunication("2");
        await waitFor(() => {
            mockAxios.mockResponseFor(
                getQueryUrlFromParams(apiPaths.communicationsByStudent, { studentId, sort: "timestamp" }),
                getBaseOkResponse(
                    getBasePage(apiPaths.communicationsByStudent, communicationCollectionName, [
                        communication,
                    ])
                )
            );
        });

        const template = getBaseCommunicationTemplate("4");
        await waitFor(() => {
            mockAxios.mockResponseFor(communication._links.template.href, getBaseOkResponse(template));
        });

        await waitFor(() => expect(list.getByText(template.name)).toBeInTheDocument());

        await userEvent.click(list.getByTestId("open-studentinfo"));
    });
});
