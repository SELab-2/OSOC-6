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
import apiPaths from "../src/properties/apiPaths";
import { act, render, screen, waitFor } from "@testing-library/react";
import { ISkillType, skillTypeCollectionName } from "../src/api/entities/SkillTypeEntity";
import AssignmentItem from "../src/components/project_assignment/assignmentItem";
import { SWRConfig } from "swr";
import { assignmentCollectionName, IAssignment } from "../src/api/entities/AssignmentEntity";
import { IUser, UserRole } from "../src/api/entities/UserEntity";
import { IStudent } from "../src/api/entities/StudentEntity";
import { IProjectSkill } from "../src/api/entities/ProjectSkillEntity";
import { capitalize } from "../src/utility/stringUtil";
import userEvent from "@testing-library/user-event";

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

    await act(() => mockAxios.mockResponseFor({ url: apiPaths.skillTypesByName }, response));

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

        await waitFor(() => {
            expect(screen.getByTestId("remove assignment button")).toBeInTheDocument();
        });

        await act(async () => await userEvent.click(screen.getByTestId("remove assignment button")));

        await waitFor(() => {
            expect(mockAxios.delete).toHaveBeenCalled();
        });

        const response: AxiosResponse = getBaseNoContentResponse();
        await act(() => mockAxios.mockResponseFor({ url: assignment._links.self.href }, response));

        await waitFor(() => {
            expect(screen.getByText(capitalize("no users for skill"))).toBeInTheDocument();
        });
    });
});
