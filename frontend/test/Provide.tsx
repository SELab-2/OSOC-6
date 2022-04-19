import { SWRConfig } from "swr";
import { ProjectList } from "../src/components/projectList";

jest.mock("next/router", () => require("next-router-mock"));

export function makeCacheFree(Component: any) {
    return (
        <SWRConfig value={{ provider: () => new Map() }}>
            <Component />
        </SWRConfig>
    );
}
