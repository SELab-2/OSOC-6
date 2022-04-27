import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { StudentFilterComponent } from "../src/components/studentFilterComponent";

describe("student filter component", () => {
    it("should render", () => {
        render(<StudentFilterComponent />);
    });
});
