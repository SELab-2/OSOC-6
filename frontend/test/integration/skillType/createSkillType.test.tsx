import "@testing-library/jest-dom";
import {render, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import {SkillType} from "../../../src/api/entities/SkillTypeEntity";
import CreateSkillTypePage from "../../../src/pages/skillTypes/create";

jest.mock("next/router", () => require("next-router-mock"));

describe("create skillType", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders", () => {
        const form = render(<CreateSkillTypePage/>);
        expect(form.getByTestId("skill-type-create-form")).toBeInTheDocument();
    });

    it("Sends the form and calls post", async () => {
        const spy = jest.spyOn(
            require("../../../src/handlers/createSkillTypeSubmitHandler"),
            "createSkillTypeSubmitHandler"
        );

        const form = render(<CreateSkillTypePage />);

        const nameElement = form.getByTestId("name");
        const colourElement = form.getByTestId("colour") as HTMLInputElement;

        const name = "Racing cars";
        // Just check if it takes the default colour. Setting it in the test is a pain.
        const colour: string = colourElement.value;
        const skillType = new SkillType(name, colour);

        await userEvent.type(nameElement, name);

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(skillType, mockRouter, expect.anything());
        });

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.skillTypes, skillType, expect.anything());
        });
    });
});
