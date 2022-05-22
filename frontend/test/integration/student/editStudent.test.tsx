import "@testing-library/jest-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import {
    EnglishProficiency,
    englishProficiencyAsString,
    Gender,
    genderAsString,
    IStudent,
    OsocExperience,
    Student,
} from "../../../src/api/entities/StudentEntity";
import { enableActForResponse, enableUseEditionComponentWrapper, makeCacheFree } from "../Provide";
import { getBaseActiveEdition, getBaseOkResponse, getBaseStudent } from "../TestEntityProvider";
import StudentEdit from "../../../src/pages/students/[id]/edit";
import { capitalize } from "../../../src/utility/stringUtil";
import applicationPaths from "../../../src/properties/applicationPaths";
import { extractIdFromApiEntityUrl } from "../../../src/api/calls/baseCalls";

jest.mock("next/router", () => require("next-router-mock"));

describe("edit student", () => {
    const edition = getBaseActiveEdition("1", "testedition");

    const studentId = "3";
    const student: IStudent = getBaseStudent(studentId);

    let page: RenderResult;

    beforeEach(async () => {
        mockRouter.query = {
            id: studentId,
        };

        page = render(makeCacheFree(() => enableUseEditionComponentWrapper(() => <StudentEdit />, edition)));

        await enableActForResponse(apiPaths.students + "/" + studentId, getBaseOkResponse(student));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders", async () => {
        await page.findByTestId("student-create-form");
    });

    it("renders with data", async () => {
        await page.findByDisplayValue(student.callName);
        await page.findByDisplayValue(student.firstName);
        await page.findByDisplayValue(student.lastName);
        await page.findByDisplayValue(student.email);
        await page.findByDisplayValue(student.phoneNumber);
        await page.findByText(capitalize(genderAsString[student.gender]));
        await page.findByDisplayValue(student.pronouns);
        await page.findByDisplayValue(student.mostFluentLanguage);
        await page.findByText(capitalize(englishProficiencyAsString[student.englishProficiency]));
        await page.findByDisplayValue(student.institutionName);
        await page.findByDisplayValue(student.currentDiploma);
        await page.findByDisplayValue(student.yearInCourse);
        await page.findByDisplayValue(student.durationCurrentDegree);
        await page.findByDisplayValue(student.curriculumVitaeURI);
        await page.findByDisplayValue(student.portfolioURI);
        await page.findByDisplayValue(student.motivationURI);
        await page.findByDisplayValue(student.writtenMotivation);
        await page.findByText(student.osocExperience);
        for (const study of student.studies) {
            await page.findByText(study);
        }
        for (const skill of student.skills) {
            await page.findByText(skill);
        }
    });

    it("change some fields and call patch", async () => {
        const spy = jest.spyOn(
            require("../../../src/handlers/createStudentSubmitHandler"),
            "createStudentSubmitHandler"
        );

        const callNameElement = page.getByTestId("callName");
        const genderElement = page.getByTestId("gender");
        const englishProficiencyElement = page.getByTestId("englishProficiency");
        const durationCurrentDegreeElement = page.getByTestId("durationCurrentDegree");
        const cVURIElement = page.getByTestId("curriculumVitaeURI");
        const writtenMotivationElement = page.getByTestId("writtenMotivation");
        const osocExperienceElement = page.getByTestId("osocExperience");

        const itemListInputElements = page.getAllByTestId("item-list-input");
        const itemListAddElements = page.getAllByTestId("item-list-add-button");
        const itemDeleteElements = page.getAllByTestId("item-list-delete-button");

        await userEvent.clear(callNameElement);
        await userEvent.clear(durationCurrentDegreeElement);
        await userEvent.clear(cVURIElement);
        await userEvent.clear(writtenMotivationElement);
        await userEvent.click(itemDeleteElements[0]);

        const newCallName = "Chaned";
        const newGender = Gender.transgender;
        const newEnglishProficiency = EnglishProficiency.readNotWrite;
        const newStudies = ["chemistry"];
        const newDurationCurrentDegree = 7;
        const newCVURI = "https://totalyaurl.com";
        const newWrittenMotivation = "Super motivated";
        const newOsocExperience = OsocExperience.none;

        const updatedStudent = new Student(
            student.email,
            student.additionalStudentInfo,
            student.bestSkill,
            newCallName,
            student.currentDiploma,
            newCVURI,
            newDurationCurrentDegree,
            newEnglishProficiency,
            student.firstName,
            newGender,
            student.institutionName,
            student.lastName,
            student.mostFluentLanguage,
            student.motivationURI,
            newOsocExperience,
            student.status,
            student.phoneNumber,
            student.workType,
            student.daytimeResponsibilities,
            student.portfolioURI,
            student.pronouns,
            student.funFact,
            student.skills,
            newStudies,
            newWrittenMotivation,
            student.yearInCourse,
            edition._links.self.href
        );

        await userEvent.type(callNameElement, newCallName);
        await userEvent.selectOptions(genderElement, [newGender]);
        await userEvent.selectOptions(englishProficiencyElement, [newEnglishProficiency]);
        await userEvent.type(durationCurrentDegreeElement, String(newDurationCurrentDegree));
        await userEvent.type(cVURIElement, newCVURI);
        await userEvent.type(writtenMotivationElement, newWrittenMotivation);
        await userEvent.selectOptions(osocExperienceElement, [newOsocExperience]);

        await userEvent.type(itemListInputElements[0], newStudies[0]);
        await userEvent.click(itemListAddElements[0]);

        await userEvent.click(page.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(
                expect.anything(),
                updatedStudent,
                expect.anything(),
                expect.anything()
            );
        });

        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalledWith(
                student._links.self.href,
                updatedStudent,
                expect.anything()
            );
        });

        await enableActForResponse(student._links.self.href, getBaseOkResponse(student));

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(
                "/" + applicationPaths.students + "/" + extractIdFromApiEntityUrl(student._links.self.href)
            );
        });
    });
});
