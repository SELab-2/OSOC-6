import { render } from "@testing-library/react";
import Home from "../src/pages/home";
import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Home page", () => {
    it("should be able to render.", () => {
        render(<Home />);
    });
});
