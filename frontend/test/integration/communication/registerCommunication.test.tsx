import "@testing-library/jest-dom";
import { RegisterCommunication } from "../../../src/components/communication/registerCommunication";
import { render, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import apiPaths from "../../../src/properties/apiPaths";
import {
    getBaseCommunicationTemplate,
    getBaseForbiddenResponse,
    getBaseOkResponse,
    getBasePage,
    getBaseStudent,
    getBaseTeapot,
} from "../TestEntityProvider";
import {
    communicationTemplateCollectionName,
    CommunicationTemplateEntity,
} from "../../../src/api/entities/CommunicationTemplateEntity";
import userEvent from "@testing-library/user-event";
import { enableActForResponse, makeCacheFree } from "../Provide";
import applicationPaths from "../../../src/properties/applicationPaths";

jest.mock("next/router", () => require("next-router-mock"));

describe("RegisterCommunication", () => {
    const studentId = "5";
    mockRouter.query.id = studentId;
    const baseStudent = getBaseStudent(studentId);
    const baseTemplate = getBaseCommunicationTemplate("6");

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render", async () => {
        render(makeCacheFree(RegisterCommunication));
        await screen.getByTestId("register-communication");
    });

    it("should handle error", async () => {
        console.log = jest.fn();
        render(<RegisterCommunication />);
        await enableActForResponse(apiPaths.students + "/" + studentId, getBaseTeapot());

        await waitFor(() => expect(console.log).toHaveBeenCalled());
    });

    it("should render with data", async () => {
        render(makeCacheFree(RegisterCommunication));

        await enableActForResponse(
            apiPaths.communicationTemplates,
            getBaseOkResponse(
                getBasePage(apiPaths.communicationTemplates, communicationTemplateCollectionName, [
                    baseTemplate,
                ])
            )
        );
        await enableActForResponse(apiPaths.students + "/" + studentId, getBaseOkResponse(baseStudent));
    });

    it("should select template", async () => {
        render(makeCacheFree(RegisterCommunication));

        await enableActForResponse(
            apiPaths.communicationTemplates,
            getBaseOkResponse(
                getBasePage(apiPaths.communicationTemplates, communicationTemplateCollectionName, [
                    baseTemplate,
                ])
            )
        );
        await enableActForResponse(apiPaths.students + "/" + studentId, getBaseOkResponse(baseStudent));

        await userEvent.click(screen.getByTestId("template-select"));
        await userEvent.click(screen.getByTestId(baseTemplate._links.self.href));

        await waitFor(() => {
            expect(screen.getByTestId("communication-form"));
        });
    });

    it("should create new", async () => {
        const template = new CommunicationTemplateEntity(
            baseTemplate.name,
            baseTemplate.subject,
            baseTemplate.template
        );
        render(makeCacheFree(RegisterCommunication));

        await enableActForResponse(
            apiPaths.communicationTemplates,
            getBaseOkResponse(
                getBasePage(apiPaths.communicationTemplates, communicationTemplateCollectionName, [
                    baseTemplate,
                ])
            )
        );
        await enableActForResponse(apiPaths.students + "/" + studentId, getBaseOkResponse(baseStudent));

        await userEvent.click(screen.getByTestId("new-template"));
        await waitFor(() => expect(screen.getByTestId("template-form")));

        await userEvent.type(screen.getByTestId("name"), baseTemplate.name);
        await userEvent.type(screen.getByTestId("subject"), baseTemplate.subject);
        await userEvent.type(screen.getByTestId("template"), baseTemplate.template);

        await userEvent.click(screen.getByTestId("submit"));
        await enableActForResponse(apiPaths.communicationTemplates, getBaseOkResponse(baseTemplate));
        await waitFor(() => {
            expect(mockRouter.pathname).toEqual(
                "/" +
                    applicationPaths.students +
                    "/" +
                    studentId +
                    "/" +
                    applicationPaths.communicationRegistration
            );
        });
    });

    it("should edit existing template", async () => {
        render(makeCacheFree(RegisterCommunication));

        await enableActForResponse(
            apiPaths.communicationTemplates,
            getBaseOkResponse(
                getBasePage(apiPaths.communicationTemplates, communicationTemplateCollectionName, [
                    baseTemplate,
                ])
            )
        );
        await enableActForResponse(apiPaths.students + "/" + studentId, getBaseOkResponse(baseStudent));

        await userEvent.click(screen.getByTestId("template-select"));
        await userEvent.click(screen.getByTestId(baseTemplate._links.self.href));

        await userEvent.click(screen.getByTestId("edit-template"));
        await waitFor(() => expect(screen.getByTestId("template-form")));

        await userEvent.click(screen.getByTestId("submit"));
        await enableActForResponse(baseTemplate._links.self.href, getBaseOkResponse(baseTemplate));
        await waitFor(() => {
            expect(mockRouter.pathname).toEqual(
                "/" +
                    applicationPaths.students +
                    "/" +
                    studentId +
                    "/" +
                    applicationPaths.communicationRegistration
            );
        });
    });
});
