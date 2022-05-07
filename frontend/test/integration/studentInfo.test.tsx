import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import {
    getBaseActiveEdition,
    getBaseLinks,
    getBaseOkResponse,
    getBasePage,
    getBaseSkillType,
    getBaseStudent,
    getBaseSuggestion,
    getBaseUser,
} from "./TestEntityProvider";
import { makeCacheFree } from "./Provide";
import { StudentInfo } from "../../src/components/studentInfo";
import { IStudent } from "../../src/api/entities/StudentEntity";
import { jest } from "@jest/globals";
import { ISuggestion, suggestionCollectionName } from "../../src/api/entities/SuggestionEntity";
import mockAxios from "jest-mock-axios";
import { IUser, userCollectionName, UserRole } from "../../src/api/entities/UserEntity";
import mockRouter from "next-router-mock";
import apiPaths from "../../src/properties/apiPaths";
import { skillTypeCollectionName } from "../../src/api/entities/SkillTypeEntity";
import { getQueryUrlFromParams } from "../../src/api/calls/baseCalls";
import { editionCollectionName } from "../../src/api/entities/EditionEntity";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("StudentInfo", () => {
    it("should render without data.", () => {
        render(makeCacheFree(StudentInfo));
        expect(mockAxios.get).toHaveBeenCalled();
    });

    it("should render with data.", async () => {
        mockRouter.setCurrentUrl("/students/10");
        mockRouter.query = { id: "10" };
        await render(makeCacheFree(StudentInfo));

        const id = "10";
        const baseStudent: IStudent = getBaseStudent(id);
        await waitFor(() =>
            mockAxios.mockResponseFor(
                { method: "GET", url: baseStudent._links.self.href },
                getBaseOkResponse(baseStudent)
            )
        );

        const baseSuggestion: ISuggestion = getBaseSuggestion();
        await waitFor(() =>
            mockAxios.mockResponseFor(
                { method: "GET", url: baseStudent._links.suggestions.href },
                getBaseOkResponse(
                    getBaseLinks(baseStudent._links.suggestions.href, suggestionCollectionName, [
                        baseSuggestion,
                    ])
                )
            )
        );

        const baseCoach: IUser = getBaseUser("5", UserRole.admin, true);
        await waitFor(() =>
            mockAxios.mockResponseFor(
                { method: "GET", url: baseSuggestion._links.coach.href },
                getBaseOkResponse(
                    getBaseLinks(baseSuggestion._links.coach.href, userCollectionName, [baseCoach])
                )
            )
        );

        const baseSkill = getBaseSkillType("5");
        const skillUrl = getQueryUrlFromParams(apiPaths.skillTypesByName, {
            name: baseSkill.name,
        });

        await waitFor(() => {
            mockAxios.mockResponseFor(
                { method: "GET", url: skillUrl },
                getBaseOkResponse(getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [baseSkill]))
            );
        });

        await waitFor(() => expect(screen.getByText(baseStudent.callName)).toBeInTheDocument());
    });
});
