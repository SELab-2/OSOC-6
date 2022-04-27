import { Container } from "react-bootstrap";
import AssignmentItem from "./assignmentItem";
import { IProject } from "../../api/entities/ProjectEntity";
import useSWR from "swr";
import { getAllProjectSkillsFromLinks } from "../../api/calls/projectSkillCalls";
import WarningToast from "./warningToast";

/**
 * This class returns a sorted list of all the skills appointed to a project.
 * @param item Project you want the skills from.
 * @constructor
 */
export default function SkillItem(item: { project: IProject }) {
    let { data, error } = useSWR(item.project._links.neededSkills.href, getAllProjectSkillsFromLinks);

    if (error) {
        return (
            <WarningToast
                message={"An error occurred, if you are experiencing issues please reload the page."}
            />
        );
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
                        <Container key={index}>
                            <AssignmentItem skill={skill} />
                        </Container>
                    );
                })}
            </>
        );
    }
    return <p>Loading...</p>;
}
