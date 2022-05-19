import "@testing-library/jest-dom";
import {act, render, screen, waitFor} from "@testing-library/react";
import {
    getBaseBadRequestResponse,
    getBaseLinks, getBaseNoContentResponse,
    getBaseOkResponse,
    getBasePage,
    getBaseSkillType,
    getBaseStudent,
    getBaseSuggestion,
    getBaseUser,
} from "../TestEntityProvider";
import { makeCacheFree } from "../Provide";
import { StudentInfo } from "../../../src/components/student/studentInfo";
import { IStudent } from "../../../src/api/entities/StudentEntity";
import { jest } from "@jest/globals";
import { ISuggestion, suggestionCollectionName } from "../../../src/api/entities/SuggestionEntity";
import mockAxios from "jest-mock-axios";
import { IUser, userCollectionName, UserRole } from "../../../src/api/entities/UserEntity";
import mockRouter from "next-router-mock";
import apiPaths from "../../../src/properties/apiPaths";
import { skillTypeCollectionName } from "../../../src/api/entities/SkillTypeEntity";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import userEvent from "@testing-library/user-event";
import applicationPaths from "../../../src/properties/applicationPaths";
import {AxiosResponse} from "axios";

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
        const studentId = "10";

        mockRouter.setCurrentUrl("/students/" + studentId);
        mockRouter.query = { id: studentId };

        render(makeCacheFree(StudentInfo));

        const baseStudent: IStudent = getBaseStudent(studentId);
        const baseSuggestion: ISuggestion = getBaseSuggestion("11");
        const baseCoach: IUser = getBaseUser("12", UserRole.admin, true);
        const baseSkillType = getBaseSkillType("13");
        baseSkillType.name = baseStudent.skills[0];

        await waitFor(() =>
            mockAxios.mockResponseFor(apiPaths.students + "/" + studentId, getBaseOkResponse(baseStudent))
        );

        await waitFor(() =>
            mockAxios.mockResponseFor(
                baseStudent._links.suggestions.href,
                getBaseOkResponse(
                    getBaseLinks(baseStudent._links.suggestions.href, suggestionCollectionName, [
                        baseSuggestion,
                    ])
                )
            )
        );

        await waitFor(() =>
            mockAxios.mockResponseFor(baseSuggestion._links.coach.href, getBaseOkResponse(baseCoach))
        );

        await waitFor(() => {
            mockAxios.mockResponseFor(
                getQueryUrlFromParams(apiPaths.skillTypesByName, {
                    name: baseStudent.skills[0],
                }),
                getBaseOkResponse(getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [baseSkillType]))
            );
        });

        await waitFor(() => expect(screen.getByText(baseStudent.callName)).toBeInTheDocument());
    });

    it("should call delete", async () => {
        const studentId = "10";

        mockRouter.setCurrentUrl("/students/" + studentId);
        mockRouter.query = { id: studentId };

        render(makeCacheFree(StudentInfo));

        const baseStudent: IStudent = getBaseStudent(studentId);
        await waitFor(() =>
            mockAxios.mockResponseFor(apiPaths.students + "/" + studentId, getBaseOkResponse(baseStudent))
        );

        const deleteButton = await screen.findByTestId("delete-student");
        await userEvent.click(deleteButton);

        await waitFor(() => expect(mockAxios.delete).toHaveBeenCalled())
        const response: AxiosResponse = getBaseNoContentResponse()
        act(() => mockAxios.mockResponseFor({ url: baseStudent._links.self.href }, response));
    })

    it("delete should fail", async () => {
        const studentId = "10";

        mockRouter.setCurrentUrl("/students/" + studentId);
        mockRouter.query = { id: studentId };

        render(makeCacheFree(StudentInfo));

        const baseStudent: IStudent = getBaseStudent(studentId);
        await waitFor(() =>
            mockAxios.mockResponseFor(apiPaths.students + "/" + studentId, getBaseOkResponse(baseStudent))
        );

        const deleteButton = await screen.findByTestId("delete-student");
        await userEvent.click(deleteButton);

        await waitFor(() => expect(mockAxios.delete).toHaveBeenCalled());
        const response: AxiosResponse = getBaseBadRequestResponse();
        act(() => mockAxios.mockResponseFor({ url: baseStudent._links.self.href }, response));

        const warning = await screen.findByTestId("warning")
        await waitFor(() => {
            expect(warning).toBeVisible()
        })
    })
});
