import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import CommunicationTemplateCreate from "../src/pages/communicationTemplate/create";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { CommunicationTemplateEntity } from "../src/api/entities/CommunicationTemplateEntity";

jest.mock("next/router", () => require("next-router-mock"));

describe("create communication template", () => {
    it("renders", () => {
        render(<CommunicationTemplateCreate />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Sends the form", async () => {
        const spy = jest.spyOn(
            require("../src/handlers/createCommunicationTemplateSubmitHandler"),
            "createCommunicationTemplateSubmitHandler"
        );

        const form = render(<CommunicationTemplateCreate />);

        const nameElement = form.getByTestId("name");
        const templateElement = form.getByTestId("template");

        const name = "Invitation mail";
        const template = "We invite you to participate selecting students with out\nstudent selection tool";
        await userEvent.type(nameElement, name);
        await userEvent.type(templateElement, template);

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(new CommunicationTemplateEntity(name, template), mockRouter);
        });
    });
});
