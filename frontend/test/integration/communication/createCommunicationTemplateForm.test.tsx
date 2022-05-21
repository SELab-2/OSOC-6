import "@testing-library/jest-dom";
import {getBaseCommunicationTemplate, getBaseStudent} from "../TestEntityProvider";
import {render, waitFor} from "@testing-library/react";
import {CommunicationTemplateEntity} from "../../../src/api/entities/CommunicationTemplateEntity";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import CreateCommunicationTemplateForm from "../../../src/components/communication/createCommunicationTemplateForm";

jest.mock("next/router", () => require("next-router-mock"));

describe("create communication template", () => {
    const template = getBaseCommunicationTemplate("1");
    const student = getBaseStudent("1");

    it("renders create", async () => {
        const page = render(<CreateCommunicationTemplateForm />);
        await expect(page.getByTestId("template-form")).toBeInTheDocument();
    });

    it("renders edit", async () => {
        const page = render(<CreateCommunicationTemplateForm template={template}/>);
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

        const form = render(<CreateCommunicationTemplateForm />);

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
            expect(spy).toHaveBeenCalledWith(null, comTemplate, mockRouter, expect.anything());
        });

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                apiPaths.communicationTemplates,
                comTemplate,
                expect.anything()
            );
        });
    });
});