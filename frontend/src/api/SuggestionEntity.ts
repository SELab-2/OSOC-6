import { IBaseEntity, IPage, IReferencer } from "./BaseEntities";

export enum SuggestionStrategy {
    yes = "YES",
    maybe = "MAYBE",
    no = "NO",
}

export interface ISuggestion extends IBaseEntity {
    reason: string;
    strategy: SuggestionStrategy;
    timestamp: string;

    _links: {
        coach: IReferencer;
        student: IReferencer;
        suggestion: IReferencer;
        self: IReferencer;
    };
}

export type ISuggestionPage = IPage<{ suggestions: ISuggestion[] }>;

export class Suggestion {
    constructor(strategy: SuggestionStrategy, reason: string, coach: string, student: string) {
        this.strategy = strategy;
        this.reason = reason;
        this.coach = coach;
        this.student = student;
    }

    strategy: SuggestionStrategy;
    reason: string;
    coach: string;
    student: string;
}
