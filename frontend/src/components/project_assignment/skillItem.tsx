import { Container } from "react-bootstrap";
import AssignmentItem from "./assignmentItem";
import useSWR, { useSWRConfig } from "swr";
import { getAllProjectSkillsFromLinks } from "../../api/calls/projectSkillCalls";
import WarningToast from "./warningToast";
import useTranslation from "next-translate/useTranslation";
import {capitalize} from "../../utility/stringUtil";

/**
 * This class returns a sorted list of all the skills appointed to a project.
 * @param props Properties
 * @constructor
 */
export default function SkillItem(props: any) {
    const { t } = useTranslation("common");

    const { mutate } = useSWRConfig();
    let { data, error } = useSWR(props.project._links.neededSkills.href, getAllProjectSkillsFromLinks);

    if (error) {
        return (
            <WarningToast
                message={capitalize(t("error reload page"))}
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
            return <p>{capitalize(t("no skills for project"))}</p>;
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
    return <p>{capitalize(t("loading"))}</p>;
}
