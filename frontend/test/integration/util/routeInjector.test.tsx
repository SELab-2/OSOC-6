import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import { cleanup, render, waitFor } from "@testing-library/react";
import { enableActForResponse, makeCacheFree } from "../Provide";
import React from "react";
import RouteInjector from "../../../src/components/util/routeInjector";
import { getBaseActiveEdition, getBaseOkResponse, getBasePage } from "../TestEntityProvider";
import GlobalContext from "../../../src/context/globalContext";
import apiPaths from "../../../src/properties/apiPaths";
import { editionCollectionName } from "../../../src/api/entities/EditionEntity";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import { StudentList } from "../../../src/components/student/studentList";

jest.mock("next/router", () => require("next-router-mock"));

describe("routeInjector", () => {
    afterEach(() => {
        mockAxios.reset();
        cleanup();
    });

    it("Should change context to query path edition", async () => {
        const setEditionUrl = jest.fn();
        const editionName = "edition 1";
        mockRouter.query.edition = editionName;

        render(
            makeCacheFree(() => (
                <GlobalContext.Provider value={{ editionUrl: undefined, setEditionUrl }}>
                    <RouteInjector />
                </GlobalContext.Provider>
            ))
        );

        await enableActForResponse(
            getQueryUrlFromParams(apiPaths.editionByName, { name: editionName }),
            getBaseOkResponse(
                getBasePage(apiPaths.editionByName, editionCollectionName, [
                    getBaseActiveEdition("10", editionName),
                ])
            )
        );

        await waitFor(() => {
            expect(setEditionUrl).toHaveBeenCalled();
        });
    });

    it("Makes sure studentlist calls with correct edition", async () => {
        const editionId = "1";
        const edition = getBaseActiveEdition(editionId, "edition 1");

        render(
            makeCacheFree(() => (
                <GlobalContext.Provider
                    value={{ editionUrl: edition._links.self.href, setEditionUrl: () => {} }}
                >
                    <RouteInjector>
                        <StudentList isDraggable={false} />
                    </RouteInjector>
                </GlobalContext.Provider>
            ))
        );

        expect(mockAxios.get).toHaveBeenCalledWith(
            getQueryUrlFromParams(apiPaths.studentByQuery, { edition: editionId }),
            expect.anything()
        );
    });
});
