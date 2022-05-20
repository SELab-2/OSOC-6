import { IBaseEntity, IEntityLinks, IPage, IReferencer } from './BaseEntities';

export enum EnglishProficiency {
    /**
     * Can understand your form, but it is hard for me to reply.
     */
    readNotWrite = "READ_NOT_WRITE",

    /**
     * Can have simple conversations.
     */
    simpleConversation = "SIMPLE_CONVERSATION",

    /**
     * Can express themselves, understand people and get a point across.
     */
    expressive = "EXPRESSIVE",

    /**
     * Can have extensive and complicated conversations.
     */
    extensive = "EXTENSIVE",

    /**
     * Fluent in English.
     */
    fluent = "FLUENT",
}

export enum Gender {
    female = "FEMALE",
    male = "MALE",
    transgender = "TRANSGENDER",
    not_specified = "NOT_SPECIFIED",
}

export enum OsocExpericience {
    none = "NONE",
    yes_noStudentCoach = "YES_NO_STUDENT_COACH",
    yes_studentCoach = "YES_STUDENT_COACH",
}

export enum Status {
    undecided = "UNDECIDED",
    maybe = "MAYBE",
    rejected = "REJECTED",
    approved = "APPROVED",
    contract_confirmed = "CONTRACT_CONFIRMED",
    contract_declined = "CONTRACT_DECLINED",
}

export interface IStudent extends IBaseEntity {
    email: string;
    additionalStudentInfo: string;
    bestSkill: string;
    callName: string;
    currentDiploma: string;
    curriculumVitaeURI: string;
    durationCurrentDegree: number;
    englishProficiency: EnglishProficiency;
    firstName: string;
    gender: Gender;
    institutionName: string;
    lastName: string;
    mostFluentLanguage: string;
    motivationURI: string;
    osocExperience: OsocExpericience;
    status: Status;
    phoneNumber: string;
    workType: string;
    daytimeResponsibilities: string;
    portfolioURI: string;
    pronouns: string;
    funFact: string;
    skills: string[];
    studies: string[];
    writtenMotivation: string;
    yearInCourse: string;
    yesSuggestionCount: number;
    noSuggestionCount: number;
    maybeSuggestionCount: number;

    _links: {
        assignments: IReferencer;
        edition: IReferencer;
        suggestions: IReferencer;
        student: IReferencer;
        self: IReferencer;
    };
}

/**
 * An [IStudent] that is completely empty. Using this we don't need as much ?. in our code.
 */
export const emptyStudent: IStudent = {
    callName: "",
    noSuggestionCount: 0,
    maybeSuggestionCount: 0,
    additionalStudentInfo: "",
    yesSuggestionCount: 0,
    bestSkill: "",
    currentDiploma: "",
    curriculumVitaeURI: "",
    daytimeResponsibilities: "",
    email: "",
    durationCurrentDegree: 0,
    englishProficiency: EnglishProficiency.readNotWrite,
    firstName: "",
    funFact: "",
    gender: Gender.not_specified,
    institutionName: "",
    lastName: "",
    mostFluentLanguage: "",
    motivationURI: "",
    osocExperience: OsocExpericience.none,
    phoneNumber: "",
    portfolioURI: "",
    pronouns: "",
    skills: [],
    status: Status.undecided,
    studies: [],
    workType: "",
    writtenMotivation: "",
    yearInCourse: "",
    _links: {
        student: { href: "" },
        self: { href: "" },
        assignments: { href: "" },
        edition: { href: "" },
        suggestions: { href: "" },
    },
};

export const studentCollectionName: string = "students";
export type IStudentPage = IPage<{ students: IStudent[] }>;
export type IStudentLinks = IEntityLinks<{ students: IStudent[] }>;

export function sortStudentsByName(students: IStudent[]) {
    return students.sort((first, second) => first.callName.localeCompare(second.callName));
}

export class Student {
    constructor(
        email: string,
        additionalStudentInfo: string,
        bestSkill: string,
        callName: string,
        currentDiploma: string,
        curriculumVitaeURI: string,
        durationCurrentDegree: number,
        englishProficiency: EnglishProficiency,
        firstName: string,
        gender: Gender,
        institutionName: string,
        lastName: string,
        mostFluentLanguage: string,
        motivationURI: string,
        osocExperience: OsocExpericience,
        status: Status,
        phoneNumber: string,
        workType: string,
        daytimeResponsibilities: string,
        portfolioURI: string,
        pronouns: string,
        funFact: string,
        skills: string[],
        studies: string[],
        writtenMotivation: string,
        yearInCourse: string,
        edition: string
    ) {
        this.email = email;
        this.additionalStudentInfo = additionalStudentInfo;
        this.bestSkill = bestSkill;
        this.callName = callName;
        this.currentDiploma = currentDiploma;
        this.curriculumVitaeURI = curriculumVitaeURI;
        this.durationCurrentDegree = durationCurrentDegree;
        this.englishProficiency = englishProficiency;
        this.firstName = firstName;
        this.gender = gender;
        this.institutionName = institutionName;
        this.lastName = lastName;
        this.mostFluentLanguage = mostFluentLanguage;
        this.motivationURI = motivationURI;
        this.osocExperience = osocExperience;
        this.status = status;
        this.phoneNumber = phoneNumber;
        this.workType = workType;
        this.daytimeResponsibilities = daytimeResponsibilities;
        this.portfolioURI = portfolioURI;
        this.pronouns = pronouns;
        this.funFact = funFact;
        this.skills = skills;
        this.studies = studies;
        this.writtenMotivation = writtenMotivation;
        this.yearInCourse = yearInCourse;
        this.edition = edition;
    }

    additionalStudentInfo: string;
    bestSkill: string;
    callName: string;
    currentDiploma: string;
    curriculumVitaeURI: string;
    durationCurrentDegree: number;
    email: string;
    englishProficiency: EnglishProficiency;
    firstName: string;
    gender: Gender;
    institutionName: string;
    lastName: string;
    mostFluentLanguage: string;
    motivationURI: string;
    osocExperience: OsocExpericience;
    status: Status;
    phoneNumber: string;
    workType: string;
    daytimeResponsibilities: string;
    portfolioURI: string;
    pronouns: string;
    funFact: string;
    skills: string[];
    studies: string[];
    writtenMotivation: string;
    yearInCourse: string;

    edition: string;
}
