import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import MyApp from "../../src/pages/_app";

describe("_app Page", () => {
    it("render _app", async () => {
        // Nothing really can be tested here as this doesn't render
        // HTML componentes
        render(makeCacheFree(() => MyApp));
    });
});
