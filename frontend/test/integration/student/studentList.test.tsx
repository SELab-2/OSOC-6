import { StudentList } from "../../../src/components/student/studentList";
import "@testing-library/jest-dom";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import {
    enableActForResponse,
    enableCurrentUser,
    enableUseEditionComponentWrapper,
    getAxiosCallWithEdition,
    makeCacheFree,
} from "../Provide";
import { jest } from "@jest/globals";
import {
    getBaseActiveEdition,
    getBaseOkResponse,
    getBasePage,
    getBaseSkillType,
    getBaseStudent,
    getBaseUser,
} from "../TestEntityProvider";
import apiPaths from "../../../src/properties/apiPaths";
import { studentCollectionName } from "../../../src/api/entities/StudentEntity";
import mockRouter from "next-router-mock";
import applicationPaths from "../../../src/properties/applicationPaths";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import { UserRole } from "../../../src/api/entities/UserEntity";
import { baseSkillType, skillTypeCollectionName } from "../../../src/api/entities/SkillTypeEntity";

jest.mock("next/router", () => require("next-router-mock"));

describe("student list", () => {
    afterEach(() => {
        mockAxios.reset();
    });

    describe("without url containing filters", () => {
        it("Initializes using axios.get()", () => {
            render(<StudentList isDraggable={false} />);
            expect(mockAxios.get).toHaveBeenCalled();
        });

        it("add student button works", async () => {
            const page = render(makeCacheFree(() => <StudentList isDraggable={false} showAdd={true} />));

            const user = getBaseUser("1", UserRole.admin, true);
            await enableCurrentUser(user);

            const addButton = page.getByTestId("new-student-button");
            await userEvent.click(addButton);

            await expect(mockRouter.asPath).toEqual("/" + applicationPaths.studentCreation);
        });

        it("Render student list and click an item", async () => {
            const id = "10";
            const student = getBaseStudent(id);

            const response: AxiosResponse = getBaseOkResponse(
                getBasePage(apiPaths.students, studentCollectionName, [student])
            );

            mockRouter.query = {};
            const initPath = mockRouter.asPath;

            render(makeCacheFree(() => <StudentList isDraggable={false} />));
            await enableActForResponse(apiPaths.studentByQuery, response);

            let studentElement = await screen.findByText(student.callName);
            expect(studentElement).toBeInTheDocument();

            await userEvent.click(studentElement);

            await waitFor(() => {
                expect(mockRouter.asPath).not.toBe(initPath);
            });
        });
    });

    describe("when url contains basic filters", () => {
        const query = { freeText: "pears and apples", unmatched: "true" };
        let list: RenderResult;
        const edition = getBaseActiveEdition("1", "edition 1");

        beforeEach(() => {
            mockRouter.query = query;
            list = render(
                enableUseEditionComponentWrapper(() => <StudentList isDraggable={false} />, edition)
            );
        });

        it("uses the filter", () => {
            expect(mockAxios.get).toHaveBeenCalledWith(
                getAxiosCallWithEdition(getQueryUrlFromParams(apiPaths.studentByQuery, query), edition),
                expect.anything()
            );
        });
    });

    describe("url contains skill filters", () => {
        const edition = getBaseActiveEdition("1", "edition 1");

        const normalSkill = "eating";
        const normalStudent = getBaseStudent("1");
        normalStudent.callName = "Normal norm";
        normalStudent.skills = [normalSkill];

        const weirdStudent = getBaseStudent("2");
        weirdStudent.callName = "weird apple eater";
        weirdStudent.skills = ["eat apples"];

        const otherSkillType = getBaseSkillType("3");
        const normalSkillType = getBaseSkillType("4");
        normalSkillType.name = normalSkill;

        it("works with normal skills", async () => {
            const query = { skills: ["apple", "pear"] };
            mockRouter.query = query;

            const list: RenderResult = render(
                makeCacheFree(() =>
                    enableUseEditionComponentWrapper(() => <StudentList isDraggable={false} />, edition)
                )
            );

            const queryUrl = getAxiosCallWithEdition(
                getQueryUrlFromParams(apiPaths.studentByQuery, { skills: query.skills.join(" ") }),
                edition
            );
            expect(mockAxios.get).toHaveBeenCalledWith(queryUrl, expect.anything());

            // Test frontend filter not to touch results
            await enableActForResponse(
                queryUrl,
                getBaseOkResponse(
                    getBasePage(apiPaths.studentByQuery, studentCollectionName, [normalStudent, weirdStudent])
                )
            );

            await enableActForResponse(
                apiPaths.skillTypes,
                getBaseOkResponse(
                    getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [
                        normalSkillType,
                        otherSkillType,
                    ])
                )
            );

            await list.findByText(weirdStudent.callName);

            await list.findByText(normalStudent.callName);
        });

        it("works with skillType other", async () => {
            mockRouter.query = { skills: baseSkillType };

            const list: RenderResult = render(
                makeCacheFree(() =>
                    enableUseEditionComponentWrapper(() => <StudentList isDraggable={false} />, edition)
                )
            );

            expect(mockAxios.get).toHaveBeenCalledWith(
                getAxiosCallWithEdition(apiPaths.studentByQuery, edition),
                expect.anything()
            );

            // Test if frontend filter works
            await enableActForResponse(
                getAxiosCallWithEdition(apiPaths.studentByQuery, edition),
                getBaseOkResponse(
                    getBasePage(apiPaths.studentByQuery, studentCollectionName, [normalStudent, weirdStudent])
                )
            );

            await enableActForResponse(
                apiPaths.skillTypes,
                getBaseOkResponse(
                    getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [
                        normalSkillType,
                        otherSkillType,
                    ])
                )
            );

            await list.findByText(weirdStudent.callName);

            expect(await list.queryByText(normalStudent.callName)).not.toBeInTheDocument();
        });
    });
});
