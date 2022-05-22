import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import CreateCommunicationForm from "../../../src/components/communication/createCommunicationForm";
import { IStudent } from "../../../src/api/entities/StudentEntity";
import {
    getBaseCommunication,
    getBaseCommunicationTemplate,
    getBaseForbiddenResponse,
    getBaseOkResponse,
    getBaseStudent,
    getBaseUser
} from "../TestEntityProvider";
import { Communication, defaultCommunicationMedium } from "../../../src/api/entities/CommunicationEntity";
import { UserRole } from "../../../src/api/entities/UserEntity";
import { enableActForResponse, enableCurrentUser, makeCacheFree } from "../Provide";
import applicationPaths from "../../../src/properties/applicationPaths";

jest.mock("next/router", () => require("next-router-mock"));

describe("create communication", () => {
    const studentId: string = "1";
    const student: IStudent = getBaseStudent(studentId);
    const template = getBaseCommunicationTemplate("2");

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders", () => {
        const page = render(<CreateCommunicationForm student={student} template={template} />);
        expect(page.getByTestId("create-communication-form")).toBeInTheDocument();
    });

    it("renders with user error", async () => {
        console.log = jest.fn();

        const page = render(<CreateCommunicationForm student={student} template={template} />);
        expect(page.getByTestId("create-communication-form")).toBeInTheDocument();

        const form = render(
            makeCacheFree(() => <CreateCommunicationForm student={student} template={template} />)
        );
        await waitFor(() => {
            mockAxios.mockResponseFor({ url: apiPaths.ownUser }, getBaseForbiddenResponse());
        });

        await waitFor(() => {
            expect(console.log).toHaveBeenCalled();
        });
    });

    it("Sends the form and calls post", async () => {
        const spy = jest.spyOn(
            require("../../../src/handlers/createCommunicationSubmitHandler"),
            "createCommunicationSubmitHandler"
        );

        const user = getBaseUser("3", UserRole.admin, true);

        const form = render(
            makeCacheFree(() => <CreateCommunicationForm student={student} template={template} />)
        );
        await enableCurrentUser(user);

        // Wait until the next part is available
        await waitFor(() => {
            form.getByTestId("medium");
        });
        const mediumElement = form.getByTestId("medium");
        const contentElement = form.getByTestId("content");

        const medium = defaultCommunicationMedium;
        const templateUrl = template._links.self.href;
        const content = template.template;
        const subject = template.subject;
        const sender = user._links.self.href;
        const studentUrl = student._links.self.href;
        const communication = new Communication(medium, templateUrl, subject, content, sender, studentUrl);

        await userEvent.clear(mediumElement);
        await userEvent.type(mediumElement, medium);
        await userEvent.clear(contentElement);
        await userEvent.type(contentElement, content);

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(communication, expect.anything(), expect.anything());
        });

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                apiPaths.communications,
                communication,
                expect.anything()
            );
        });
        const communicationResponse = getBaseCommunication("10");
        await enableActForResponse(apiPaths.communications, getBaseOkResponse(communicationResponse));

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual("/" + applicationPaths.communicationBase + "/10");
        });
    });

    it("Sends the form and opens email", async () => {
        mockRouter.asPath =
            "/" + applicationPaths.students + "/" + studentId + "/" + applicationPaths.communicationBase;
        mockRouter.pathname =
            "/" + applicationPaths.students + "/" + studentId + "/" + applicationPaths.communicationBase;
        const mock = jest.spyOn(
            require("../../../src/handlers/createCommunicationSubmitHandler"),
            "createCommunicationSubmitHandler"
        );
        const id = "5";
        mock.mockImplementation(async (submitCom, router, mutate) => {
            await mockRouter.push("/" + applicationPaths.communicationBase + "/" + id);
            return getBaseOkResponse(getBaseCommunication(id));
        });

        const user = getBaseUser("3", UserRole.admin, true);

        const form = render(
            makeCacheFree(() => <CreateCommunicationForm student={student} template={template} />)
        );
        await enableCurrentUser(user);

        // Wait until the next part is available
        await waitFor(() => {
            form.getByTestId("medium");
        });
        const mediumElement = form.getByTestId("medium");
        const contentElement = form.getByTestId("content");

        const medium = defaultCommunicationMedium;
        const templateUrl = template._links.self.href;
        const content = template.template;
        const subject = template.subject;
        const sender = user._links.self.href;
        const studentUrl = student._links.self.href;
        const communication = new Communication(medium, templateUrl, subject, content, sender, studentUrl);

        await userEvent.clear(mediumElement);
        await userEvent.type(mediumElement, medium);

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(mock).toHaveBeenCalledWith(communication, mockRouter, expect.anything());
        });
    });
});
