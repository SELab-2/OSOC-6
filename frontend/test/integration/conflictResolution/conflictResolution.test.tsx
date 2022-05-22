import "@testing-library/jest-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import ConflictResolutionList from "../../../src/components/conflictResolution/conflictResolutionList";
import {
    getBaseAssignment,
    getBaseOkResponse,
    getBasePage,
    getBaseProject,
    getBaseProjectSkill,
    getBaseStudent,
    getBaseUser,
} from "../TestEntityProvider";
import { enableCurrentUser, makeCacheFree } from "../Provide";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import { studentCollectionName } from "../../../src/api/entities/StudentEntity";
import { getValidAssignmentsUrlForStudent } from "../../../src/api/calls/AssignmentCalls";
import userEvent from "@testing-library/user-event";
import { assignmentCollectionName } from "../../../src/api/entities/AssignmentEntity";
import { UserRole } from "../../../src/api/entities/UserEntity";

jest.mock("next/router", () => require("next-router-mock"));

describe("conflict resolution", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("without data", () => {
        it("renders", () => {
            const list = render(<ConflictResolutionList />);
            expect(list.getByTestId("conflicts")).toBeInTheDocument();
        });
    });

    describe("with data", () => {
        let list: RenderResult;
        const student = getBaseStudent("1");
        const assignments = [getBaseAssignment("2"), getBaseAssignment("3")];

        const project = getBaseProject("4");

        const projectSkills = [getBaseProjectSkill("5"), getBaseProjectSkill("6")];

        beforeEach(async () => {
            list = render(makeCacheFree(ConflictResolutionList));

            assignments[1].reason = "apple" + assignments[1].reason + "pear";
            projectSkills[1].name = "apple" + projectSkills[1].name + "pear";

            await waitFor(() => {
                mockAxios.mockResponseFor(
                    apiPaths.studentConflict,
                    getBaseOkResponse(getBasePage(apiPaths.studentConflict, studentCollectionName, [student]))
                );
            });

            const assignmentsUrl = getValidAssignmentsUrlForStudent(student._links.self.href);
            await waitFor(() =>
                mockAxios.mockResponseFor(
                    assignmentsUrl,
                    getBaseOkResponse(getBasePage(assignmentsUrl, assignmentCollectionName, assignments))
                )
            );

            await Promise.all(
                assignments.map((assignment, index) =>
                    waitFor(() =>
                        mockAxios.mockResponseFor(
                            assignment._links.projectSkill.href,
                            getBaseOkResponse(projectSkills[index])
                        )
                    )
                )
            );

            await Promise.all(
                projectSkills.map((skill) =>
                    waitFor(() => mockAxios.mockResponseFor(skill._links.self.href, getBaseOkResponse(skill)))
                )
            );

            await Promise.all(
                projectSkills.map((skill) =>
                    waitFor(() =>
                        mockAxios.mockResponseFor(skill._links.project.href, getBaseOkResponse(project))
                    )
                )
            );
        });

        it("renders correct data", async () => {
            await list.findByText(student.callName);

            for (const assignment of assignments) {
                await list.findByText(assignment.reason);
            }

            await list.findAllByText(project.name);

            for (const skill of projectSkills) {
                await list.findByText(skill.name);
            }
        });

        it("invalidates the assignments that where not selected", async () => {
            const selectedIndex = 0;
            const nonSelectedIndex = 1;

            const selectRadioElement = await list.findByTestId(
                "radio-conflict-" + projectSkills[selectedIndex]._links.self.href
            );

            await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
            await enableCurrentUser(getBaseUser("5", UserRole.admin, true));

            const submitButtonElement = await list.findByTestId("conflicts-submit");

            await userEvent.click(selectRadioElement);
            await userEvent.click(submitButtonElement);

            expect(mockAxios.patch).toHaveBeenCalledWith(
                assignments[nonSelectedIndex]._links.self.href,
                { isValid: false },
                expect.anything()
            );
        });
    });
});
