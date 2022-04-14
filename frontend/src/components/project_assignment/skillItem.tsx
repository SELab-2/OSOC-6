import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import AssignmentItem from "./assignmentItem";
import { IProjectSkill, IProjectSkillLinks } from "../../api/ProjectSkillEntity";
import { IProject } from "../../api/ProjectEntity";
import axios from "axios";
import { AxiosConf } from "../../api/requests";

export type Skills = { skill: IProjectSkill }[];

export async function getProjectSkills(projectSkillsList: IProjectSkillLinks) {
    const skills: Skills = [];

    await Promise.all(
        projectSkillsList._embedded["project-skills"].map(async (skill) => {
            skills.push({ skill });
        })
    );

    return skills;
}

async function getLinks(item: { project: IProject }) {
    const projectSkillsList: IProjectSkillLinks = (
        await axios.get(item.project._links.neededSkills.href, AxiosConf)
    ).data;
    return await getProjectSkills(projectSkillsList);
}

export default function SkillItem(item: { project: IProject }) {
    const [skillList, setSkillList] = useState<Skills>();
    useEffect(() => {
        getLinks(item).then((skills) => setSkillList(skills));
    }, [item]);

    if (skillList != undefined) {
        if (skillList.length == 0) {
            return <p>No skills have been assigned to this project</p>;
        }

        return (
            <>
                {skillList.map((skill, index) => {
                    return (
                        <Container key={index}>
                            <AssignmentItem skill={skill.skill} />
                        </Container>
                    );
                })}
            </>
        );
    }
    return <p>Loading...</p>;
}
