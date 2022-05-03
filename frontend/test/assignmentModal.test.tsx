import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import {
    getBaseOkResponse,
    getBaseProject,
    getBaseProjectSkill,
    getBaseSkillType,
    getBaseStudent,
    getBaseUser,
} from "./TestEntityProvider";
import { act, render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import AssignmentModal from "../src/components/project_assignment/assignmentModal";
import { Dispatch } from "react";
import userEvent from "@testing-library/user-event";
import { AxiosResponse } from "axios";
import { UserRole } from "../src/api/entities/UserEntity";
import { Assignment } from "../src/api/entities/AssignmentEntity";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

type SkillInfo = { skillName: string; skillColor: string; skillUrl: string };
type ModalInfo = { studentName: string; studentUrl: string; skillInfo: SkillInfo; projectName: string };

async function renderAssignmentModal(modalInfo: ModalInfo, showModal: boolean, setter: Dispatch<boolean>) {
    render(
        makeCacheFree(() => AssignmentModal({ modalInfo: modalInfo, showModal: showModal, setter: setter }))
    );
}

describe("Assignment modal", () => {
    it("It should render", async () => {
        const student = getBaseStudent("1");
        const projectSkill = getBaseProjectSkill("2");
        const skillType = getBaseSkillType("3");
        const skillInfo: SkillInfo = {
            skillName: projectSkill.name,
            skillColor: skillType.colour,
            skillUrl: projectSkill._links.self.href,
        };
        const project = getBaseProject("4");
        const modalInfo = {
            studentName: student.firstName,
            studentUrl: student._links.self.href,
            skillInfo: skillInfo,
            projectName: project.name,
        };
        const setter: Dispatch<boolean> = (_) => {};
        await renderAssignmentModal(modalInfo, true, setter);

        await waitFor(() => {
            expect(screen.getByText(student.firstName, { exact: false })).toBeInTheDocument();
            expect(screen.getByText(project.name, { exact: false })).toBeInTheDocument();
            expect(screen.getByText(projectSkill.name, { exact: false })).toBeInTheDocument();
        });
    });

    it("Test submit", async () => {
        const student = getBaseStudent("1");
        const projectSkill = getBaseProjectSkill("2");
        const skillType = getBaseSkillType("3");
        const skillInfo: SkillInfo = {
            skillName: projectSkill.name,
            skillColor: skillType.colour,
            skillUrl: projectSkill._links.self.href,
        };
        const project = getBaseProject("4");
        const modalInfo = {
            studentName: student.firstName,
            studentUrl: student._links.self.href,
            skillInfo: skillInfo,
            projectName: project.name,
        };
        let testBool = true;
        const setter: Dispatch<boolean> = (value) => {
            testBool = value;
        };
        await renderAssignmentModal(modalInfo, true, setter);

        await userEvent.click(screen.getByRole("button"));

        const user = getBaseUser("5", UserRole.admin, true);
        const ownUserResponse: AxiosResponse = getBaseOkResponse(user);

        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalled();
        });

        await act(() => mockAxios.mockResponseFor({ method: "GET" }, ownUserResponse));

        const assignment = new Assignment(
            false,
            true,
            "",
            user._links.self.href,
            student._links.self.href,
            projectSkill._links.self.href
        );
        const assignmentResponse: AxiosResponse = getBaseOkResponse(assignment);

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalled();
        });

        await act(() => mockAxios.mockResponseFor({ method: "POST" }, assignmentResponse));

        // Setter needs to set value back to 'false' to hide the modal
        await waitFor(() => {
            expect(testBool).toBeFalsy();
        });
    });
});
