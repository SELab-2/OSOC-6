import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import {
    EnglishProficiency,
    Gender,
    OsocExperience,
    Status,
    Student,
} from "../../../src/api/entities/StudentEntity";
import {enableActForResponse, enableUseEditionComponentWrapper, makeCacheFree} from "../Provide";
import {getBaseActiveEdition, getBaseOkResponse, getBaseStudent} from "../TestEntityProvider";
import StudentCreate from "../../../src/pages/students/create";
import applicationPaths from "../../../src/properties/applicationPaths";
import {extractIdFromApiEntityUrl} from "../../../src/api/calls/baseCalls";

jest.mock("next/router", () => require("next-router-mock"));

describe("create student", () => {
    const edition = getBaseActiveEdition("1", "testedition");

    it("renders", async () => {
        const page = render(
            makeCacheFree(() => enableUseEditionComponentWrapper(() => <StudentCreate />, edition))
        );
        await page.findByTestId("student-create");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Sends the form and calls post", async () => {
        const spy = jest.spyOn(
            require("../../../src/handlers/createStudentSubmitHandler"),
            "createStudentSubmitHandler"
        );

        const form = render(
            makeCacheFree(() => enableUseEditionComponentWrapper(() => <StudentCreate />, edition))
        );
        const callNameElement = form.getByTestId("callName");
        const firstNameElement = form.getByTestId("firstName");
        const lastNameElement = form.getByTestId("lastName");
        const emailElement = form.getByTestId("email");
        const phoneNumberElement = form.getByTestId("phoneNumber");
        const genderElement = form.getByTestId("gender");
        const pronounsElement = form.getByTestId("pronouns");
        const mostFluentLanguageElement = form.getByTestId("mostFluentLanguage");
        const englishProficiencyElement = form.getByTestId("englishProficiency");
        const institutionElement = form.getByTestId("institution");
        const currentDiplomaElement = form.getByTestId("currentDiploma");
        const yearInCourseElement = form.getByTestId("yearInCourse");
        const durationCurrentDegreeElement = form.getByTestId("durationCurrentDegree");
        const cVURIElement = form.getByTestId("curriculumVitaeURI");
        const portfolioURIElement = form.getByTestId("portfolioURI");
        const motivationURIElement = form.getByTestId("motivationURI");
        const writtenMotivationElement = form.getByTestId("writtenMotivation");
        const osocExperienceElement = form.getByTestId("osocExperience");

        const itemListInputElements = form.getAllByTestId("item-list-input");
        const itemListAddElements = form.getAllByTestId("item-list-add-button");

        const callName = "Bob Tester";
        const firstName = "Bob";
        const lastName = "Tester";
        const email = "bob@tester.com";
        const phoneNumber = "+321234567323";
        const gender = Gender.transgender;
        const pronouns = "they/them";
        const mostFluentLanguage = "Vietnamese";
        const englishProficiency = EnglishProficiency.readNotWrite;
        const studies = ["math", "chemistry"];
        const institution = "VUB";
        const currentDiploma = "Master";
        const yearInCourse = "3rd";
        const durationCurrentDegree = 7;
        const skills = ["back end", "front end"];
        const cVURI = "https://cv.example.com";
        const portolfioUri = "https://portfolio.example.com";
        const motivationUri = "https://motivation.example.com";
        const writtenMotivation = "I am legend";
        const osocExperience = OsocExperience.yes_noStudentCoach;
        const student = new Student(
            email,
            "",
            "",
            callName,
            currentDiploma,
            cVURI,
            durationCurrentDegree,
            englishProficiency,
            firstName,
            gender,
            institution,
            lastName,
            mostFluentLanguage,
            motivationUri,
            osocExperience,
            Status.undecided,
            phoneNumber,
            "",
            "",
            portolfioUri,
            pronouns,
            "",
            skills,
            studies,
            writtenMotivation,
            yearInCourse,
            edition._links.self.href
        );

        await userEvent.type(callNameElement, callName);
        await userEvent.type(firstNameElement, firstName);
        await userEvent.type(lastNameElement, lastName);
        await userEvent.type(emailElement, email);
        await userEvent.type(phoneNumberElement, phoneNumber);
        await userEvent.selectOptions(genderElement, [gender]);
        await userEvent.type(pronounsElement, pronouns);
        await userEvent.type(mostFluentLanguageElement, mostFluentLanguage);
        await userEvent.selectOptions(englishProficiencyElement, [englishProficiency]);
        await userEvent.type(institutionElement, institution);
        await userEvent.type(currentDiplomaElement, currentDiploma);
        await userEvent.type(yearInCourseElement, yearInCourse);
        await userEvent.type(durationCurrentDegreeElement, String(durationCurrentDegree));
        await userEvent.type(cVURIElement, cVURI);
        await userEvent.type(portfolioURIElement, portolfioUri);
        await userEvent.type(motivationURIElement, motivationUri);
        await userEvent.type(writtenMotivationElement, writtenMotivation);
        await userEvent.selectOptions(osocExperienceElement, [osocExperience]);

        for (const study of studies) {
            await userEvent.type(itemListInputElements[0], study);
            await userEvent.click(itemListAddElements[0]);
        }
        for (const skill of skills) {
            await userEvent.type(itemListInputElements[1], skill);
            await userEvent.click(itemListAddElements[1]);
        }

        await userEvent.click(form.getByTestId("submit"));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(null, student, mockRouter, expect.anything());
        });

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.students, student, expect.anything());
        });

        const studentResponse = getBaseStudent("4");

        await enableActForResponse(apiPaths.students, getBaseOkResponse(studentResponse));

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual(
                "/" +
                applicationPaths.students +
                "/" +
                extractIdFromApiEntityUrl(studentResponse._links.self.href)
            );
        });
        // This is a long running test because of all the promises that are created
    }, 20000);
});
