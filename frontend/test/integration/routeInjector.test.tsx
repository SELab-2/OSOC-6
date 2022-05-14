import { jest } from "@jest/globals";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import { cleanup, render, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import React from "react";
import RouteInjector from "../../src/components/util/routeInjector";
import { getBaseActiveEdition, getBaseOkResponse, getBasePage } from "./TestEntityProvider";
import GlobalContext from "../../src/context/globalContext";
import apiPaths from "../../src/properties/apiPaths";
import { editionCollectionName } from "../../src/api/entities/EditionEntity";
import { getQueryUrlFromParams } from "../../src/api/calls/baseCalls";
import { StudentList } from "../../src/components/student/studentList";

jest.mock("next/router", () => require("next-router-mock"));

describe("routeInjector", () => {
    afterEach(() => {
        mockAxios.reset();
        cleanup();
    });

    it("Should change router to usedEdition", () => {
        const edition = getBaseActiveEdition("1", "edition 1");

        render(
            makeCacheFree(() => (
                <GlobalContext.Provider value={{ edition, setEdition: () => {} }}>
                    <RouteInjector />
                </GlobalContext.Provider>
            ))
        );

        expect(mockRouter.query.edition).toEqual(edition.name);
    });

    it("Should change context to query path edition", async () => {
        const setEdition = jest.fn();
        const editionName = "edition 1";
        mockRouter.query.edition = editionName;

        render(
            makeCacheFree(() => (
                <GlobalContext.Provider value={{ edition: undefined, setEdition }}>
                    <RouteInjector />
                </GlobalContext.Provider>
            ))
        );

        await waitFor(() => {
            mockAxios.mockResponseFor(
                getQueryUrlFromParams(apiPaths.editionByName, { name: editionName }),
                getBaseOkResponse(
                    getBasePage(apiPaths.editionByName, editionCollectionName, [
                        getBaseActiveEdition("10", editionName),
                    ])
                )
            );
        });

        await waitFor(() => {
            expect(setEdition).toHaveBeenCalled();
        });
    });

    it("Makes sure studentlist calls with correct edition", async () => {
        const editionId = "1";
        const edition = getBaseActiveEdition(editionId, "edition 1");

        render(
            makeCacheFree(() => (
                <GlobalContext.Provider value={{ edition, setEdition: () => {} }}>
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
