import { Container } from "react-bootstrap";
import AssignmentItem from "./assignmentItem";
import useSWR, { useSWRConfig } from "swr";
import { getAllProjectSkillsFromLinks } from "../../api/calls/projectSkillCalls";
import WarningToast from "./warningToast";

/**
 * This class returns a sorted list of all the skills appointed to a project.
 * @param props Properties
 * @constructor
 */
export default function SkillItem(props: any) {
    const { mutate } = useSWRConfig();
    let { data, error } = useSWR(props.project._links.neededSkills.href, getAllProjectSkillsFromLinks);

    if (error) {
        return (
            <WarningToast
                message={"An error occurred, if you are experiencing issues please reload the page."}
            />
        );
    }
    async function dropStudent(studentUrl: string, skillUrl: string) {
        props.dropHandler(studentUrl, skillUrl);
        await mutate(props.project._links.neededSkills.href);
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
