import "@testing-library/jest-dom";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import CreateCommunicationForm from "../../../src/components/communication/createCommunicationForm";
import { IStudent } from "../../../src/api/entities/StudentEntity";
import {
    getBaseCommunicationTemplate,
    getBaseOkResponse,
    getBasePage,
    getBaseStudent,
    getBaseUser
} from "../TestEntityProvider";
import { Communication } from "../../../src/api/entities/CommunicationEntity";
import { UserRole } from "../../../src/api/entities/UserEntity";
import { enableCurrentUser, makeCacheFree } from "../Provide";
import { communicationTemplateCollectionName } from "../../../src/api/entities/CommunicationTemplateEntity";

jest.mock("next/router", () => require("next-router-mock"));

describe("create communication", () => {
    const student: IStudent = getBaseStudent("1");

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders", () => {
        const page = render(<CreateCommunicationForm student={student} />);
        expect(page.getByTestId("create-communication-form")).toBeInTheDocument();
    });

    it("Sends the form and calls post", async () => {
        const spy = jest.spyOn(
            require("../../../src/handlers/createCommunicationSubmitHandler"),
            "createCommunicationSubmitHandler"
        );

        const user = getBaseUser("3", UserRole.admin, true);

        const form = render(makeCacheFree(() => <CreateCommunicationForm student={student} />));
        await enableCurrentUser(user);

        const template = getBaseCommunicationTemplate("2");
        await act(async () => {
            await waitFor(() => {
                mockAxios.mockResponseFor(
                    apiPaths.communicationTemplates,
                    getBaseOkResponse(
                        getBasePage(apiPaths.communicationTemplates, communicationTemplateCollectionName, [
                            template,
                        ])
                    )
                );
            });
        });

        // Select the current template
        await waitFor(async () => {
            await userEvent.click(form.getByTestId("template-select-main"));

            form.getByTestId("template-select-" + template._links.self.href);
        });
        await userEvent.click(form.getByTestId("template-select-" + template._links.self.href));

        // Wait until the next part is available
        await waitFor(() => {
            form.getByTestId("medium");
        });
        const mediumElement = form.getByTestId("medium");
        const contentElement = form.getByTestId("content");

        const medium = "email";
        const templateUrl = template._links.self.href;
        const content = template.template;
        const sender = user._links.self.href;
        const studentUrl = student._links.self.href;
        const communication = new Communication(medium, templateUrl, content, sender, studentUrl);

        await userEvent.clear(mediumElement);
        await userEvent.type(mediumElement, medium);

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(communication, mockRouter, expect.anything());
        });

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                apiPaths.communications,
                communication,
                expect.anything()
            );
        });
    });
});
