import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

export interface IAssignment extends IBaseEntity {
    isSuggestion: boolean;
    isValid: boolean;
    reason: string;
    timestamp: string;

    _links: {
        assigner: IReferencer;
        project: IReferencer;
        student: IReferencer;
        assignment: IReferencer;
        self: IReferencer;
    };
}

export type IAssignmentPage = IPage<{ assignments: IAssignment[] }>;
export type IAssignmentLinks = IEntityLinks<{ assignments: IAssignment[] }>;

export class Assignment {
    constructor(
        isSuggestion: boolean,
        isValid: boolean,
        reason: string,
        assigner: string,
        student: string,
        project: string
    ) {
        this.isSuggestion = isSuggestion;
        this.isValid = isValid;
        this.reason = reason;
        this.assigner = assigner;
        this.student = student;
        this.project = project;
    }

    isSuggestion: boolean;
    isValid: boolean;
    reason: string;
    assigner: string;
    student: string;
    project: string;
}
