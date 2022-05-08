import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import {
    getBaseAssignment,
    getBaseLinks,
    getBaseNoContentResponse,
    getBaseOkResponse,
    getBasePage,
    getBaseProjectSkill,
    getBaseSkillType,
    getBaseStudent,
    getBaseUser,
} from "./TestEntityProvider";
import apiPaths from "../../src/properties/apiPaths";
import { act, render, screen, waitFor } from "@testing-library/react";
import { ISkillType, skillTypeCollectionName } from "../../src/api/entities/SkillTypeEntity";
import AssignmentItem from "../../src/components/project_assignment/assignmentItem";
import { SWRConfig } from "swr";
import { assignmentCollectionName, IAssignment } from "../../src/api/entities/AssignmentEntity";
import { IUser, UserRole } from "../../src/api/entities/UserEntity";
import { IStudent } from "../../src/api/entities/StudentEntity";
import { IProjectSkill } from "../../src/api/entities/ProjectSkillEntity";
import { capitalize } from "../../src/utility/stringUtil";
import userEvent from "@testing-library/user-event";
import { getQueryUrlFromParams } from "../../src/api/calls/baseCalls";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

/**
 * Function to generate an AssignmentItem component with the necessary data for the tests.
 * It is only capable of generating one skill.
 * @param skillType List of SkillTypes
 * @param assignments List of assignments (to the skill)
 * @param assigner Assigner of the skill
 * @param student Student you want to assign
 * @param projectSkill The skill you want to assign the student to.
 */
async function renderAssignmentItem(
    skillType: ISkillType[],
    assignments: IAssignment[],
    assigner: IUser | undefined,
    student: IStudent | undefined,
    projectSkill: IProjectSkill
) {
    const response: AxiosResponse = getBaseOkResponse(
        getBasePage(apiPaths.skillTypesByName, skillTypeCollectionName, skillType)
    );
    await act(() => {
        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <AssignmentItem skill={projectSkill} />
            </SWRConfig>
        );
    });

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    await act(() =>
        mockAxios.mockResponseFor(
            { url: getQueryUrlFromParams(apiPaths.skillTypesByName, { name: projectSkill.name }) },
            response
        )
    );

    const assignmentResponse: AxiosResponse = getBaseOkResponse(
        getBaseLinks(projectSkill._links.assignments.href, assignmentCollectionName, assignments)
    );

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    await act(() =>
        mockAxios.mockResponseFor({ url: projectSkill._links.assignments.href }, assignmentResponse)
    );

    if (student != undefined) {
        const studentResponse: AxiosResponse = getBaseOkResponse(student);

        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalled();
        });

        await act(() =>
            mockAxios.mockResponseFor({ url: assignments[0]._links.student.href }, studentResponse)
        );
    }

    if (assigner != undefined) {
        const assignerResponse: AxiosResponse = getBaseOkResponse(assigner);

        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalled();
        });

        await act(() =>
            mockAxios.mockResponseFor({ url: assignments[0]._links.assigner.href }, assignerResponse)
        );
    }
}

async function createResponse(
    assignment: IAssignment,
    id: string,
    studentName: string,
    assignerName: string
) {
    const assigner = getBaseUser(id, UserRole.admin, true);
    const student = getBaseStudent(id);
    student.firstName = studentName;
    assigner.callName = assignerName;
    const studentResponse: AxiosResponse = getBaseOkResponse(student);

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    await act(() => mockAxios.mockResponseFor({ url: assignment._links.student.href }, studentResponse));

    const assignerResponse: AxiosResponse = getBaseOkResponse(assigner);

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    await act(() => mockAxios.mockResponseFor({ url: assignment._links.assigner.href }, assignerResponse));
}

async function removeAssignment(assignment: IAssignment, id: string) {
    await waitFor(() => {
        expect(screen.getByTestId("remove assignment button " + id)).toBeInTheDocument();
    });
    await act(async () => await userEvent.click(screen.getByTestId("remove assignment button " + id)));

    await waitFor(() => {
        expect(mockAxios.delete).toHaveBeenCalled();
    });

    const response: AxiosResponse = getBaseNoContentResponse();
    await act(() => mockAxios.mockResponseFor({ url: assignment._links.self.href }, response));
}

describe("Assignmnent item tests", () => {
    it("should render with users assigned", async () => {
        const skillType = getBaseSkillType("1");
        const assignment = getBaseAssignment("2");
        const assigner = getBaseUser("2", UserRole.admin, true);
        const student = getBaseStudent("2");
        const projectSkill = getBaseProjectSkill("100");
        await renderAssignmentItem([skillType], [assignment], assigner, student, projectSkill);

        await waitFor(() => {
            expect(screen.getByText(projectSkill.name)).toBeInTheDocument();
            expect(screen.getByText(student.firstName)).toBeInTheDocument();
            expect(screen.getByText(assigner.callName, { exact: false })).toBeInTheDocument();
            expect(screen.getByText(assignment.reason, { exact: false })).toBeInTheDocument();
        });
    });

    it("Should render with no users assigned", async () => {
        const skillType = getBaseSkillType("1");
        const projectSkill = getBaseProjectSkill("100");
        await renderAssignmentItem([skillType], [], undefined, undefined, projectSkill);

        await waitFor(() => {
            expect(screen.getByText(capitalize("no users for skill"))).toBeInTheDocument();
        });
    });

    it("Remove assignment", async () => {
        const skillType = getBaseSkillType("1");
        const assignment = getBaseAssignment("2");
        const assigner = getBaseUser("2", UserRole.admin, true);
        const student = getBaseStudent("2");
        const projectSkill = getBaseProjectSkill("100");
        await renderAssignmentItem([skillType], [assignment], assigner, student, projectSkill);

        await removeAssignment(assignment, "0");

        await waitFor(() => {
            expect(screen.getByText(capitalize("no users for skill"))).toBeInTheDocument();
        });
    });

    it("Remove one assignment of list", async () => {
        const skillType = getBaseSkillType("1");
        const assignment = getBaseAssignment("2");
        const assignment2 = getBaseAssignment("3");
        const assigner = getBaseUser("2", UserRole.admin, true);
        const student = getBaseStudent("2");
        const projectSkill = getBaseProjectSkill("100");
        await renderAssignmentItem([skillType], [assignment, assignment2], assigner, student, projectSkill);
        await createResponse(assignment2, "3", "a", "assigner1");

        await removeAssignment(assignment, "1");

        await waitFor(() => {
            expect(screen.getByText(projectSkill.name)).toBeInTheDocument();
            expect(screen.getByText("a")).toBeInTheDocument();
            expect(screen.getByText("assigner1", { exact: false })).toBeInTheDocument();
            expect(screen.getByText(assignment.reason, { exact: false })).toBeInTheDocument();
        });
    });

    it("Test if assignments are sorted", async () => {
        const skillType = getBaseSkillType("1");
        const assignment = getBaseAssignment("2");
        const assignment3 = getBaseAssignment("3");
        assignment3.reason = "assignment3";
        const assignment4 = getBaseAssignment("4");
        assignment4.reason = "assignment4";
        const assignment5 = getBaseAssignment("5");
        assignment5.reason = "assignment5";
        const assignment6 = getBaseAssignment("6");
        assignment6.reason = "assignment6";
        const assignment7 = getBaseAssignment("7");
        assignment7.reason = "assignment7";
        const assigner = getBaseUser("2", UserRole.admin, true);
        const student = getBaseStudent("2");
        const projectSkill = getBaseProjectSkill("100");
        await renderAssignmentItem(
            [skillType],
            [assignment, assignment3, assignment4, assignment5, assignment6, assignment7],
            assigner,
            student,
            projectSkill
        );

        await createResponse(assignment3, "3", "a", "assigner1");
        await createResponse(assignment4, "4", "c", "assigner1");
        await createResponse(assignment5, "5", "b", "assigner1");
        await createResponse(assignment6, "6", "b", "assigner3");
        await createResponse(assignment7, "7", "b", "assigner2");

        await waitFor(() => {
            const html = document.body.innerHTML;
            const a1 = html.search(assignment3.reason);
            const a2 = html.search(assignment5.reason);
            const a3 = html.search(assignment7.reason);
            const a4 = html.search(assignment6.reason);
            const a5 = html.search(assignment4.reason);
            const a6 = html.search(assignment.reason);
            expect(screen.getByTestId("assignment-item")).toBeInTheDocument();
            expect(a1).toBeLessThan(a2);
            expect(a2).toBeLessThan(a3);
            expect(a3).toBeLessThan(a4);
            expect(a4).toBeLessThan(a5);
            expect(a5).toBeLessThan(a6);
        });
    });
});
