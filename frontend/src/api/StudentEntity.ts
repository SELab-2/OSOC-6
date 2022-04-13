import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

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

export enum PronounsType {
    SHE = "SHE",
    he = "HE",
    they = "THEY",
    ze = "ZE",
    firstName = "FIRSTNAME",
    callName = "CALLNAME",
    other = "OTHER",
    none = "NONE",
}

export interface IStudent extends IBaseEntity {
    email: string;
    additionalStudentInfo: string;
    bestSkill: string;
    callName: string;
    currentDiploma: string;
    curriculumVitaeURI: string;
    durationCurrentDegree: number;
    educationLevel: string;
    englishProficiency: EnglishProficiency;
    firstName: string;
    gender: Gender;
    institutionName: string;
    lastName: string;
    mostFluentLanguage: string;
    motivationURI: string;
    osocExperience: OsocExpericience;
    phoneNumber: string;
    portfolioURI: string;
    pronounsType: PronounsType;
    skills: string[];
    studies: string[];
    writtenMotivation: string;
    yearInCourse: string;
    subjectivePronoun: string;
    possessivePronoun: string;
    objectivePronoun: string;

    _links: {
        assignments: IReferencer;
        edition: IReferencer;
        suggestions: IReferencer;
        student: IReferencer;
        self: IReferencer;
    };
}

export type IStudentPage = IPage<{ students: IStudent[] }>;
export type IStudentLinks = IEntityLinks<{ students: IStudent[] }>;

export class Student {
    constructor(
        email: string,
        additionalStudentInfo: string,
        bestSkill: string,
        callName: string,
        currentDiploma: string,
        curriculumVitaeURI: string,
        durationCurrentDegree: number,
        educationLevel: string,
        englishProficiency: EnglishProficiency,
        firstName: string,
        gender: Gender,
        institutionName: string,
        lastName: string,
        mostFluentLanguage: string,
        motivationURI: string,
        osocExperience: OsocExpericience,
        phoneNumber: string,
        portfolioURI: string,
        subjectivePronoun: string,
        possessivePronoun: string,
        objectivePronoun: string,
        pronounsType: PronounsType,
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
        this.educationLevel = educationLevel;
        this.englishProficiency = englishProficiency;
        this.firstName = firstName;
        this.gender = gender;
        this.institutionName = institutionName;
        this.lastName = lastName;
        this.mostFluentLanguage = mostFluentLanguage;
        this.motivationURI = motivationURI;
        this.osocExperience = osocExperience;
        this.phoneNumber = phoneNumber;
        this.portfolioURI = portfolioURI;
        this.subjectivePronoun = subjectivePronoun;
        this.possessivePronoun = possessivePronoun;
        this.objectivePronoun = objectivePronoun;
        this.pronounsType = pronounsType;
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
    educationLevel: string;
    email: string;
    englishProficiency: EnglishProficiency;
    firstName: string;
    gender: Gender;
    institutionName: string;
    lastName: string;
    mostFluentLanguage: string;
    motivationURI: string;
    osocExperience: OsocExpericience;
    phoneNumber: string;
    portfolioURI: string;
    subjectivePronoun: string;
    possessivePronoun: string;
    objectivePronoun: string;
    pronounsType: PronounsType;
    skills: string[];
    studies: string[];
    writtenMotivation: string;
    yearInCourse: string;

    edition: string;
}
