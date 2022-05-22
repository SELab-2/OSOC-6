import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import {
    getBaseAssignment,
    getBaseNoContentResponse,
    getBaseOkResponse,
    getBasePage,
    getBaseProjectSkill,
    getBaseSkillType,
    getBaseStudent,
    getBaseUser,
} from "../TestEntityProvider";
import apiPaths from "../../../src/properties/apiPaths";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { ISkillType, skillTypeCollectionName } from "../../../src/api/entities/SkillTypeEntity";
import ProjectSkillItem from "../../../src/components/projectAssignment/projectSkillItem";
import { assignmentCollectionName, IAssignment } from "../../../src/api/entities/AssignmentEntity";
import { IUser, UserRole } from "../../../src/api/entities/UserEntity";
import { IStudent } from "../../../src/api/entities/StudentEntity";
import { IProjectSkill } from "../../../src/api/entities/ProjectSkillEntity";
import { capitalize } from "../../../src/utility/stringUtil";
import userEvent from "@testing-library/user-event";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import { enableActForResponse, makeCacheFree } from "../Provide";
import { getValidAssignmentsUrlForProjectSkill } from "../../../src/api/calls/AssignmentCalls";

jest.mock("next/router", () => require("next-router-mock"));

describe("Assignment item", () => {
    let projectSkill: IProjectSkill;

    beforeEach(() => {
        projectSkill = getBaseProjectSkill("1");
    });

    afterEach(() => {
        mockAxios.reset();
    });

    describe("without data", () => {
        let item: RenderResult;

        it("renders", async () => {
            item = render(makeCacheFree(() => <ProjectSkillItem skill={projectSkill} />));

            await item.findByTestId("assignment-item");
            await item.findByText(projectSkill.name);
        });
    });

    describe("with data", () => {
        let assigner: IUser;
        let assignment1: IAssignment;
        let assignment2: IAssignment;
        let student1: IStudent;
        let student2: IStudent;
        let skillType: ISkillType;

        let item: RenderResult;

        beforeEach(async () => {
            assigner = getBaseUser("2", UserRole.admin, true);

            assignment1 = getBaseAssignment("3");
            assignment1.reason = "This first student is lit!";
            assignment2 = getBaseAssignment("4");
            assignment2.reason = "The second student is better!";

            student1 = getBaseStudent("5");
            student1.firstName = "student1 first name";
            student2 = getBaseStudent("6");
            student2.firstName = "second student first name";

            skillType = getBaseSkillType("7");

            item = render(makeCacheFree(() => <ProjectSkillItem skill={projectSkill} />));

            // Answer skillTypes
            const skillTypeUrl = getQueryUrlFromParams(apiPaths.skillTypesByName, {
                name: projectSkill.name,
            });
            await enableActForResponse(
                skillTypeUrl,
                getBaseOkResponse(getBasePage(skillTypeUrl, skillTypeCollectionName, [skillType]))
            );

            // Answer assignments
            const assignmentsUrl = getValidAssignmentsUrlForProjectSkill(projectSkill._links.self.href);
            await enableActForResponse(
                assignmentsUrl,
                getBaseOkResponse(
                    getBasePage(assignmentsUrl, assignmentCollectionName, [assignment1, assignment2])
                )
            );

            // Answer student for each assignment
            await enableActForResponse(assignment1._links.student.href, getBaseOkResponse(student1));
            await enableActForResponse(assignment2._links.student.href, getBaseOkResponse(student2));

            // Re-request the student (this is not needed when using the swr cache, but we disable the cache in tests)
            await enableActForResponse(student1._links.self.href, getBaseOkResponse(student1));
            await enableActForResponse(student2._links.self.href, getBaseOkResponse(student2));

            // Re-request the assignment (this is not needed when using the swr cache, but we disable the cache in tests)
            await enableActForResponse(assignment1._links.self.href, getBaseOkResponse(assignment1));
            await enableActForResponse(assignment2._links.self.href, getBaseOkResponse(assignment2));

            // Answer the assigner for each
            await enableActForResponse(assignment1._links.assigner.href, getBaseOkResponse(assigner));
            await enableActForResponse(assignment2._links.assigner.href, getBaseOkResponse(assigner));
        });

        it("renders all data", async () => {
            await item.findByText(projectSkill.name);

            await item.findByText(student1.firstName);
            await item.findByText(student2.firstName);

            await item.findByText(assignment1.reason);
            await item.findByText(assignment2.reason);

            expect(await item.findAllByText(assigner.callName, { exact: false })).toHaveLength(2);
        });

        async function removeAssignment(assignment: IAssignment) {
            window.confirm = jest.fn(() => true);

            const removeButton = await item.findByTestId("remove-assignment-button-" + assignment.reason);
            await userEvent.click(removeButton);

            await enableActForResponse(
                { method: "delete", url: assignment._links.self.href },
                getBaseNoContentResponse()
            );
        }

        it("can remove an assignment", async () => {
            await removeAssignment(assignment1);

            await waitFor(async () => {
                expect(await item.queryByText(assignment1.reason)).not.toBeInTheDocument();
            });
        });

        it("can remove all assignments", async () => {
            await removeAssignment(assignment1);
            await removeAssignment(assignment2);

            await waitFor(() => {
                expect(item.getByText(capitalize("no users for skill"))).toBeInTheDocument();
            });
        });
    });
});
