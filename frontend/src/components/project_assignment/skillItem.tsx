import { Container } from "react-bootstrap";
import AssignmentItem from "./assignmentItem";
import { IProject } from "../../api/entities/ProjectEntity";
import useSWR, { useSWRConfig } from "swr";
import { getAllProjectSkillsFromLinks } from "../../api/calls/projectSkillCalls";
import WarningToast from "./warningToast";
import axios from "axios";
import apiPaths from "../../properties/apiPaths";
import { AxiosConf } from "../../api/calls/baseCalls";
import { Assignment } from "../../api/entities/AssignmentEntity";
import { IUser } from "../../api/entities/UserEntity";

/**
 * This class returns a sorted list of all the skills appointed to a project.
 * @param item Project you want the skills from.
 * @constructor
 */
export default function SkillItem(item: { project: IProject }) {
    const { mutate } = useSWRConfig();
    let { data, error } = useSWR(item.project._links.neededSkills.href, getAllProjectSkillsFromLinks);

    if (error) {
        return (
            <WarningToast
                message={"An error occurred, if you are experiencing issues please reload the page."}
            />
        );
    }
    async function dropStudent(studentUrl: string, skillUrl: string) {
        console.log(apiPaths.base + apiPaths.assignments);
        const user: IUser = (await axios.get(apiPaths.ownUser, AxiosConf)).data;
        const assignment: Assignment = new Assignment(
            false,
            true,
            "Just cuz",
            user._links.self.href,
            studentUrl,
            skillUrl
        );
        console.log(assignment);
        await axios.post(apiPaths.base + apiPaths.assignments, assignment, AxiosConf);
        await mutate(item.project._links.neededSkills.href);
    }

    let skillList = data || undefined;

    if (skillList != undefined) {
        skillList.sort((skill1, skill2) => {
            if (skill1.name > skill2.name) {
                return 1;
            }

            if (skill1.name < skill2.name) {
                return -1;
            }

            return 0;
        });

        if (skillList.length == 0) {
            return <p>No skills have been assigned to this project</p>;
        }

        return (
            <>
                {skillList.map((skill, index) => {
                    return (
                        <Container
                            key={index}
                            onDrop={(e) => {
                                e.preventDefault();
                                dropStudent(e.dataTransfer.getData("url"), skill._links.projectSkill.href);
                                console.log();
                            }}
                            onDragOver={(event) => {
                                event.preventDefault();
                            }}
                        >
                            <AssignmentItem skill={skill} />
                        </Container>
                    );
                })}
            </>
        );
    }
    return <p>Loading...</p>;
}
