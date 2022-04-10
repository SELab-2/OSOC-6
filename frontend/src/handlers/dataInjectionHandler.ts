import { MouseEventHandler } from 'react';
import axios from 'axios';
import pathNames from '../properties/pathNames';
import { IUser } from '../api/UserEntity';
import { Edition, EditionsPage, IEdition } from '../api/EditionEntity';
import {
    IInvitation,
    Invitation,
    InvitationsPage,
} from '../api/InvitationEntity';
import { IProject, Project, ProjectPage } from '../api/ProjectEntity';
import {
    IProjectSkill,
    ProjectSkill,
    ProjectSkillPage,
} from '../api/ProjectSkillEntity';

const baseRef = { baseURL: pathNames.base };

export const dataInjectionHandler: MouseEventHandler<
    HTMLButtonElement
> = async (_) => {
    const user: IUser = (await axios.get(pathNames.ownUser, baseRef)).data;
    console.log(user);

    const own_user_url: string = user._links!.self.href;

    const editions: EditionsPage = (
        await axios.get(pathNames.editions, baseRef)
    ).data;
    console.log(editions);
    let containedEdition: IEdition;
    if (editions._embedded.editions.length == 0) {
        const edition1: Edition = new Edition('Edition 1', 2022, true);
        containedEdition = (
            await axios.post(pathNames.editions, edition1, baseRef)
        ).data;
    } else {
        containedEdition = editions._embedded.editions[0];
    }
    console.log(containedEdition);
    const editionUrl: string = containedEdition._links!.self.href;

    const invitations: InvitationsPage = (
        await axios.get(pathNames.invitations, baseRef)
    ).data;
    let containedInvitation: IInvitation;
    if (invitations._embedded.invitations.length == 0) {
        const invitation1 = new Invitation(own_user_url, editionUrl);
        containedInvitation = (
            await axios.post(pathNames.invitations, invitation1, baseRef)
        ).data;
    } else {
        containedInvitation = invitations._embedded.invitations[0];
    }
    console.log(containedInvitation);

    const projects: ProjectPage = (await axios.get(pathNames.projects, baseRef))
        .data;
    let containedProjects: IProject[];
    if (projects._embedded.projects.length == 0) {
        const project1: Project = new Project(
            'Bring the world back',
            '',
            [],
            'A woman to work with',
            '',
            editionUrl,
            own_user_url
        );

        const project2: Project = new Project(
            'More boulder',
            '',
            [],
            'Boulder De Boulder',
            '',
            editionUrl,
            own_user_url
        );

        containedProjects = await Promise.all(
            [project1, project2].map(
                async (proj) =>
                    (
                        await axios.post(pathNames.projects, proj, baseRef)
                    ).data
            )
        );
    } else {
        containedProjects = projects._embedded.projects;
    }
    console.log(containedProjects);

    const projectSkills: ProjectSkillPage = (
        await axios.get(pathNames.projectSkills, baseRef)
    ).data;
    let containedProjectSkills: IProjectSkill[];
    if (projectSkills._embedded['project-skills'].length == 0) {
        const skill1: ProjectSkill = new ProjectSkill(
            'V10 boulderer',
            'We need strong climbers to test our boulders',
            containedProjects[1]._links!.self.href
        );

        containedProjectSkills = await Promise.all(
            [skill1].map(
                async (skill) =>
                    (
                        await axios.post(
                            pathNames.projectSkills,
                            skill,
                            baseRef
                        )
                    ).data
            )
        );
    } else {
        containedProjectSkills = projectSkills._embedded['project-skills'];
    }
    console.log(containedProjectSkills);
};
