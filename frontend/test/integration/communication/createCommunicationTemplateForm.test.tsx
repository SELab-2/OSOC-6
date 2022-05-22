import "@testing-library/jest-dom";
import { getBaseCommunicationTemplate, getBaseOkResponse, getBaseStudent } from "../TestEntityProvider";
import { render, waitFor } from "@testing-library/react";
import { CommunicationTemplateEntity } from "../../../src/api/entities/CommunicationTemplateEntity";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import CreateCommunicationTemplateForm from "../../../src/components/communication/createCommunicationTemplateForm";
import { enableActForResponse } from "../Provide";
import applicationPaths from "../../../src/properties/applicationPaths";

jest.mock("next/router", () => require("next-router-mock"));

describe("create communication template", () => {
    const template = getBaseCommunicationTemplate("1");
    const studentId = "1";
    const student = getBaseStudent(studentId);

    it("renders create", async () => {
        const page = render(<CreateCommunicationTemplateForm studentId={studentId} />);
        await expect(page.getByTestId("template-form")).toBeInTheDocument();
    });

    it("renders edit", async () => {
        const page = render(<CreateCommunicationTemplateForm template={template} studentId={studentId} />);
        await expect(page.getByTestId("template-form")).toBeInTheDocument();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Sends the form and calls post", async () => {
        const spy = jest.spyOn(
            require("../../../src/handlers/createCommunicationTemplateSubmitHandler"),
            "createCommunicationTemplateSubmitHandler"
        );

        const form = render(<CreateCommunicationTemplateForm studentId={studentId} />);

        const nameElement = form.getByTestId("name");
        const subjectElement = form.getByTestId("subject");
        const templateElement = form.getByTestId("template");

        const name = "Invitation mail";
        const subject = "test@example.com";
        const template = "We invite you to participate selecting students with out\nstudent selection tool";
        const comTemplate = new CommunicationTemplateEntity(name, subject, template);

        await userEvent.type(nameElement, name);
        await userEvent.type(subjectElement, subject);
        await userEvent.type(templateElement, template);

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(null, studentId, comTemplate, expect.anything(), expect.anything(), expect.anything());
        });

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                apiPaths.communicationTemplates,
                comTemplate,
                expect.anything()
            );
        });
        const responseTemplate = getBaseCommunicationTemplate("10");
        await enableActForResponse(apiPaths.communicationTemplates, getBaseOkResponse(responseTemplate));

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual("/" + applicationPaths.students +
                "/" +
                studentId +
                "/" +
                applicationPaths.communicationRegistration );
        });
    });
});
