import { MouseEventHandler } from "react";
import axios from "axios";
import apiPaths from "../properties/apiPaths";
import { IUser, User } from "../api/entities/UserEntity";
import { Edition, IEdition } from "../api/entities/EditionEntity";
import { IInvitation, Invitation } from "../api/entities/InvitationEntity";
import { Project } from "../api/entities/ProjectEntity";
import { ProjectSkill } from "../api/entities/ProjectSkillEntity";
import { ICommunicationTemplate } from "../api/entities/CommunicationTemplateEntity";
import { EnglishProficiency, Gender, IStudent, OsocExperience, Status, Student } from "../api/entities/StudentEntity";
import { Communication, defaultCommunicationMedium } from "../api/entities/CommunicationEntity";
import { Suggestion, SuggestionStrategy } from "../api/entities/SuggestionEntity";
import { AxiosConf, basePost } from "../api/calls/baseCalls";
import faker from "@faker-js/faker";
import { createNewEdition, getAllEditionsFromPage } from "../api/calls/editionCalls";
import { createInvitation } from "../api/calls/invitationCalls";
import { createProject } from "../api/calls/projectCalls";
import { createProjectSkill } from "../api/calls/projectSkillCalls";
import { createNewStudent } from "../api/calls/studentCalls";
import { getAllCommunicationTemplatesFromPage } from "../api/calls/communicationTemplateCalls";
import { createNewCommunication } from "../api/calls/communicationCalls";
import { createNewSuggestion } from "../api/calls/suggestionCalls";

/* istanbul ignore next */
export const dataInjectionHandler: MouseEventHandler<HTMLButtonElement> = async (_) => {

    function randomInt(maxInt: number): number {
        return (Math.random() * (maxInt)) | 0;
    }

    console.log(randomInt(5));

    // Get your own user
    const user: IUser = (await axios.get(apiPaths.ownUser, AxiosConf)).data;
    console.log(user);
    const own_user_url: string = user._links.self.href;

    // Create our mock editions, one active
    const editions: IEdition[] = await getAllEditionsFromPage(apiPaths.editions);

    const userCount = 10;
    const projectCount = 15;
    const studentCount = 50;
    const communicationCount = 4;
    const suggestionCount = 7;
    const commonSkills = [
        "Front-end developer",
        "Back-end developer",
        "UX / UI designer",
        "Graphic designer",
        "Business Modeller",
        "Storyteller",
        "Marketer",
        "Copywriter",
        "Video editor",
        "Photographer",
        "Other",
    ];
    const diplomas = ["A professional Bachelor",
        "An academic Bachelor",
        "An associate degree",
        "A master’s degree",
        "Doctoral degree",
        "No diploma",
        "I am self taught",
        "Other"
    ];
    const english = Object.values(EnglishProficiency);
    const gender = Object.values(Gender);
    const experience = Object.values(OsocExperience);
    const statuses = Object.values(Status);
    const pronouns = [
        "she/her/hers",
        "he/him/his",
        "they/them/theirs",
        "ze/hir/hir",
        "by firstname",
        "by call name",
        "him/her/hir"
    ];
    const studies = [
        "Backend development",
        "Business management",
        "Communication Sciences",
        "Design",
        "Frontend development",
        "Marketing",
        "Photography",
        "Videography",
        "nothing"
    ];

    console.log(Array.from({ length: randomInt(4)}, () => commonSkills[randomInt(commonSkills.length)]));

    // This check is to make sure you don't inject data on a database that already has data.
    if (editions.length === 0) {
        const inactiveEdition: IEdition = await createNewEdition(new Edition("Pandemic edition", 2021, false));
        const activeEdition: IEdition = await createNewEdition(new Edition("Break free edition", 2021, true));

        // Create some users
        for (let index = 0; index < userCount; index++) {
            const invitation: IInvitation = await createInvitation(new Invitation(own_user_url, activeEdition._links.self.href));
            const registrationUser = new User(faker.name.firstName() + " " + faker.name.lastName(), faker.internet.email(), crypto.randomUUID());
            await basePost(apiPaths.base + apiPaths.registration, registrationUser, {
                token: invitation.token,
            });
        }

        // SkillTypes are already injected by the backend

        // Communication templates are already injected by the backend
        const templates = await getAllCommunicationTemplatesFromPage(apiPaths.communicationTemplates);

        // Create some projects
        for (let index = 0; index < projectCount; index++) {
            const project = await createProject(new Project(
                faker.commerce.productName(),
                faker.commerce.productDescription(),
                faker.internet.url(),
                Array.from({ length: randomInt(5) }, () => faker.lorem.sentence()),
                faker.company.companyName(),
                faker.internet.url(),
                activeEdition._links.self.href,
                own_user_url)
            );

            for (let skillIndex = 0; skillIndex < randomInt(5); skillIndex++) {
                await createProjectSkill(new ProjectSkill(
                    commonSkills[randomInt(commonSkills.length)],
                    randomInt(2) ? faker.lorem.sentence() : "", project!._links.self.href
                ));
            }

        }
        await createProject(new Project(
            faker.commerce.productName(),
            faker.commerce.productDescription(),
            faker.internet.url(),
            Array.from({ length: randomInt(5) }, () => faker.lorem.sentence()),
            faker.company.companyName(),
            faker.internet.url(),
            inactiveEdition._links.self.href,
            own_user_url)
        );

        // Create some students

        for (let studentIndex = 0; studentIndex < studentCount; studentIndex++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName()
            let student: IStudent | undefined = undefined;
            try {
                student = await createNewStudent(new Student(
                    faker.internet.email(),
                    faker.lorem.paragraph(),
                    !studentIndex ? "Perseverance" : faker.word.adjective(),
                    firstName + " " + lastName,
                    diplomas[randomInt(diplomas.length)],
                    randomInt(2) ? faker.internet.url() : "",
                    randomInt(7),
                    english[randomInt(english.length)] as EnglishProficiency,
                    firstName,
                    gender[randomInt(gender.length)] as Gender,
                    faker.company.companyName(),
                    lastName,
                    "Dutch",
                    randomInt(2) ? faker.internet.url() : "",
                    experience[randomInt(experience.length)] as OsocExperience,
                    statuses[randomInt(statuses.length)] as Status,
                    faker.phone.phoneNumber(),
                    faker.lorem.sentence(),
                    faker.lorem.sentence(),
                    faker.internet.url(),
                    pronouns[randomInt(pronouns.length)],
                    faker.lorem.sentence(),
                    Array.from({ length: randomInt(4) }, () => commonSkills[randomInt(commonSkills.length)]),
                    Array.from({ length: randomInt(3) }, () => studies[randomInt(studies.length)]),
                    faker.lorem.paragraph(),
                    "" + randomInt(5),
                    activeEdition._links.self.href
                ));
                const maxCommunications = randomInt(communicationCount);
                for (let communicationIndex = 0; communicationIndex < maxCommunications; communicationIndex++) {
                    const template : ICommunicationTemplate = templates[randomInt(templates.length)];
                    await createNewCommunication(new Communication(
                        defaultCommunicationMedium,
                        template._links.self.href,
                        template.subject,
                        template.template,
                        own_user_url,
                        student._links.self.href
                    ));
                }

                const suggestions = Object.values(SuggestionStrategy);
                const maxSuggestions = randomInt(suggestionCount);
                for (let suggestionIndex = 0; suggestionIndex < maxSuggestions; suggestionIndex++) {
                    await createNewSuggestion(new Suggestion(
                        suggestions[randomInt(suggestions.length)] as SuggestionStrategy,
                        faker.lorem.sentence(),
                        own_user_url,
                        student._links.self.href
                    ))
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    console.log("Injection done");
};
