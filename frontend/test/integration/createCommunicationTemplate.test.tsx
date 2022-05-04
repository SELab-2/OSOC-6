import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import CommunicationTemplateCreate from "../../src/pages/communicationTemplate/create";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { CommunicationTemplateEntity } from "../../src/api/entities/CommunicationTemplateEntity";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../src/properties/apiPaths";

jest.mock("next/router", () => require("next-router-mock"));

describe("create communication template", () => {
    it("renders", () => {
        const page = render(<CommunicationTemplateCreate />);
        expect(page.getByTestId("communication-template-create")).toBeInTheDocument();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Sends the form and calls post", async () => {
        const spy = jest.spyOn(
            require("../../src/handlers/createCommunicationTemplateSubmitHandler"),
            "createCommunicationTemplateSubmitHandler"
        );

        const form = render(<CommunicationTemplateCreate />);

        const nameElement = form.getByTestId("name");
        const templateElement = form.getByTestId("template");

        const name = "Invitation mail";
        const template = "We invite you to participate selecting students with out\nstudent selection tool";
        const comTemplate = new CommunicationTemplateEntity(name, template);

        await userEvent.type(nameElement, name);
        await userEvent.type(templateElement, template);

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(comTemplate, mockRouter);
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
