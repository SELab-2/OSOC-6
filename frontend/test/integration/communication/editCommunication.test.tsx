import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import CommunicationTemplateCreate from "../../../src/pages/communicationTemplates/create";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { CommunicationTemplateEntity } from "../../../src/api/entities/CommunicationTemplateEntity";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import CommunicationTemplateEditPage from "../../../src/pages/communicationTemplates/[id]/edit";
import { getBaseCommunicationTemplate, getBaseOkResponse, getBasePage } from "../TestEntityProvider";

jest.mock("next/router", () => require("next-router-mock"));

describe("edit communication template", () => {
    const templateId = "1";

    beforeEach(() => {
        mockRouter.query = {
            id: templateId,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders", () => {
        const page = render(<CommunicationTemplateEditPage />);
        expect(page.getByTestId("communication-template-edit")).toBeInTheDocument();
    });

    it("Sends the form and calls patch", async () => {
        const spy = jest.spyOn(
            require("../../../src/handlers/createCommunicationTemplateSubmitHandler"),
            "createCommunicationTemplateSubmitHandler"
        );

        const form = render(<CommunicationTemplateEditPage />);

        const templateEntity = getBaseCommunicationTemplate(templateId);
        await waitFor(() => {
            mockAxios.mockResponseFor(
                apiPaths.communicationTemplates + "/" + templateId,
                getBaseOkResponse(templateEntity)
            );
        });

        expect(await form.findByText(templateEntity.name)).toBeInTheDocument();

        const subjectElement = form.getByTestId("subject");

        const newSubject = "test@example.com";
        expect(newSubject).not.toEqual(templateEntity.subject);

        const newTemplate = new CommunicationTemplateEntity(
            templateEntity.name,
            newSubject,
            templateEntity.template
        );

        await userEvent.clear(subjectElement);
        await userEvent.type(subjectElement, newSubject);

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(
                templateEntity._links.self.href,
                newTemplate,
                mockRouter,
                expect.anything()
            );
        });

        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalledWith(
                templateEntity._links.self.href,
                newTemplate,
                expect.anything()
            );
        });
    });
});
