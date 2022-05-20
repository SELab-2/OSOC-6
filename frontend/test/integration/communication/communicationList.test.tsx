import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import StudentCommunication from "../../../src/components/communication/studentCommunication";
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
import { string } from "prop-types";

describe("communication list", () => {
    it("renders", () => {
        const page = render(<StudentCommunication student={undefined} />);
        expect(page.getByTestId("communication-list")).toBeInTheDocument();
    });

    it("Renders with data ", async () => {
        const studentId = "1";
        const student = getBaseStudent(studentId);
        const list = render(makeCacheFree(() => <StudentCommunication student={student} />));

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
});
