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
import { enableCurrentUser, makeCacheFree } from "./Provide";
import AssignmentModal, { ModalInfo } from "../../src/components/projectAssignment/assignmentModal";
import { Dispatch } from "react";
import userEvent from "@testing-library/user-event";
import { AxiosResponse } from "axios";
import { UserRole } from "../../src/api/entities/UserEntity";
import { Assignment } from "../../src/api/entities/AssignmentEntity";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Assignment modal", () => {
    const user = getBaseUser("5", UserRole.admin, true);

    async function renderAssignmentModal(
        modalInfo: ModalInfo,
        showModal: boolean,
        setter: Dispatch<boolean>
    ) {
        render(
            makeCacheFree(() =>
                AssignmentModal({
                    studentName: modalInfo.studentName,
                    studentUrl: modalInfo.studentUrl,
                    skillName: modalInfo.skillName,
                    skillUrl: modalInfo.skillUrl,
                    projectName: modalInfo.projectName,
                    showModal: showModal,
                    setter: setter,
                })
            )
        );
        await enableCurrentUser(user);
    }

    it("It should render", async () => {
        const student = getBaseStudent("1");
        const projectSkill = getBaseProjectSkill("2");
        const skillType = getBaseSkillType("3");
        const project = getBaseProject("4");
        const modalInfo = {
            studentName: student.firstName,
            studentUrl: student._links.self.href,
            skillName: projectSkill.name,
            skillColor: skillType.colour,
            skillUrl: projectSkill._links.self.href,
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
        const project = getBaseProject("4");
        const modalInfo = {
            studentName: student.firstName,
            studentUrl: student._links.self.href,
            skillName: projectSkill.name,
            skillColor: skillType.colour,
            skillUrl: projectSkill._links.self.href,
            projectName: project.name,
        };
        let testBool = true;
        const setter: Dispatch<boolean> = (value) => {
            testBool = value;
        };
        await renderAssignmentModal(modalInfo, true, setter);

        await userEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalled();
        });

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
