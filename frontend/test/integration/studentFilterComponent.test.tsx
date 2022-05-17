import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { StudentFilterComponent } from "../../src/components/student/studentFilterComponent";

jest.mock("next/router", () => require("next-router-mock"));

describe("student filter component", () => {
    it("should render", () => {
        render(<StudentFilterComponent />);
    });
});
